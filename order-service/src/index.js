import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { readDB, writeDB } from './db.js';
import { Roles, authMiddleware, requireRole } from './auth.js';
import { Status, canTransition } from './schema.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(authMiddleware);

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/menu', (req, res) => {
  const db = readDB();
  res.json(db.menu);
});

app.get('/orders', (req, res) => {
  const { status } = req.query;
  const db = readDB();
  const orders = status ? db.orders.filter(o => o.status === status) : db.orders;
  res.json(orders);
});

app.post('/orders', requireRole(Roles.USER), (req, res) => {
  const { items = [], userId = 'user-1' } = req.body || {};
  const db = readDB();
  const id = nanoid(8);
  const ts = Date.now();
  const order = {
    id, items, userId,
    status: Status.PENDING,
    timeline: [{ at: ts, action: 'CREATED', by: Roles.USER }]
  };
  db.orders.push(order);
  writeDB(db);
  res.status(201).json(order);
});

app.patch('/orders/:id/cancel', requireRole(Roles.USER), (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (order.status !== Status.PENDING) {
    return res.status(400).json({ error: 'Only PENDING orders can be cancelled' });
  }
  order.status = Status.CANCELLED;
  order.timeline.push({ at: Date.now(), action: 'CANCELLED', by: Roles.USER });
  writeDB(db);
  res.json(order);
});

function transition(res, id, toStatus, byRole) {
  const db = readDB();
  const order = db.orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (!canTransition(order.status, toStatus)) {
    return res.status(400).json({ error: `Invalid transition ${order.status} → ${toStatus}` });
  }
  order.status = toStatus;
  order.timeline.push({ at: Date.now(), action: toStatus, by: byRole });
  writeDB(db);
  return res.json(order);
}

app.patch('/orders/:id/accept', requireRole(Roles.RESTAURANT), (req, res) =>
  transition(res, req.params.id, Status.ACCEPTED, Roles.RESTAURANT)
);
app.patch('/orders/:id/prepared', requireRole(Roles.RESTAURANT), (req, res) =>
  transition(res, req.params.id, Status.PREPARED, Roles.RESTAURANT)
);
app.patch('/orders/:id/pickup', requireRole(Roles.DRIVER), (req, res) =>
  transition(res, req.params.id, Status.PICKED_UP, Roles.DRIVER)
);
app.patch('/orders/:id/deliver', requireRole(Roles.DRIVER), (req, res) =>
  transition(res, req.params.id, Status.DELIVERED, Roles.DRIVER)
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`order-service on :${PORT}`));