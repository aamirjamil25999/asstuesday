import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const ORDER_BASE = process.env.ORDER_BASE || 'http://order-service:3001';
const DRIVER_TOKEN = process.env.ROLE_DRIVER_TOKEN || 'drivertoken123';

function hdr() {
  return { 'Authorization': `Bearer ${DRIVER_TOKEN}`, 'Content-Type': 'application/json' };
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/orders/prepared', async (req, res) => {
  const r = await fetch(`${ORDER_BASE}/orders?status=PREPARED`);
  res.json(await r.json());
});

app.patch('/orders/:id/pickup', async (req, res) => {
  const r = await fetch(`${ORDER_BASE}/orders/${req.params.id}/pickup`, { method: 'PATCH', headers: hdr() });
  res.status(r.status).json(await r.json());
});

app.patch('/orders/:id/deliver', async (req, res) => {
  const r = await fetch(`${ORDER_BASE}/orders/${req.params.id}/deliver`, { method: 'PATCH', headers: hdr() });
  res.status(r.status).json(await r.json());
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`delivery-service on :${PORT}`));