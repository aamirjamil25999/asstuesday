import express from "express";
import morgan from "morgan";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const ORDER_BASE = process.env.ORDER_BASE || "http://order-service:3001";
const REST_TOKEN = process.env.ROLE_RESTAURANT_TOKEN || "resttoken123";

const hdr = () => ({
  Authorization: `Bearer ${REST_TOKEN}`,
  "Content-Type": "application/json",
});

app.get("/health", (_, res) => res.json({ ok: true }));

// ✅ Get all PENDING or ACCEPTED orders
app.get("/orders/pending", async (_, res) => {
  const resp = await fetch(`${ORDER_BASE}/orders?status=PENDING`);
  res.status(resp.status).json(await resp.json());
});

// ✅ Accept a pending order
app.post("/orders/:id/accept", async (req, res) => {
  const { id } = req.params;
  const resp = await fetch(`${ORDER_BASE}/orders/${id}/accept`, {
    method: "PATCH",
    headers: hdr(),
  });
  res.status(resp.status).json(await resp.json());
});

// ✅ Mark order as prepared
app.post("/orders/:id/prepared", async (req, res) => {
  const { id } = req.params;
  const resp = await fetch(`${ORDER_BASE}/orders/${id}/prepared`, {
    method: "PATCH",
    headers: hdr(),
  });
  res.status(resp.status).json(await resp.json());
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`restaurant-service on :${PORT}`));