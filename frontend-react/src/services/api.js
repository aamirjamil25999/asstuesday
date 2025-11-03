import axios from "axios";

const ORDER_BASE = import.meta.env.VITE_ORDER_BASE || "http://localhost:3001";
const REST_BASE  = import.meta.env.VITE_RESTAURANT_BASE || "http://localhost:3002";
const DRV_BASE   = import.meta.env.VITE_DELIVERY_BASE || "http://localhost:3003";

const USER_TOKEN  = import.meta.env.VITE_ROLE_USER_TOKEN || "usertoken123";
const REST_TOKEN  = import.meta.env.VITE_ROLE_RESTAURANT_TOKEN || "resttoken123";
const DRIVER_TOKEN= import.meta.env.VITE_ROLE_DRIVER_TOKEN || "drivertoken123";

const hdr = (tok) => ({
  headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
});

const cleanId = (id) => (id || "").toString().replace(/[^a-zA-Z0-9_-]/g, "");
const mustId = (id) => {
  const v = cleanId(id);
  if (!v) throw new Error("Order id missing");
  return v;
};

export const api = {
  
  menu:   () => axios.get(`${ORDER_BASE}/menu`, hdr(USER_TOKEN)),
  orders: () => axios.get(`${ORDER_BASE}/orders`, hdr(USER_TOKEN)),
  create: (body) => axios.post(`${ORDER_BASE}/orders`, body, hdr(USER_TOKEN)),
  
  cancel: (id) => axios.patch(`${ORDER_BASE}/orders/${mustId(id)}/cancel`, {}, hdr(USER_TOKEN)),


  restPending: () => axios.get(`${REST_BASE}/orders/pending`, hdr(REST_TOKEN)),
  
  restAccept:  (id) => axios.post(`${REST_BASE}/orders/${mustId(id)}/accept`,   {}, hdr(REST_TOKEN)),
  restPrepared:(id) => axios.post(`${REST_BASE}/orders/${mustId(id)}/prepared`, {}, hdr(REST_TOKEN)),


  drvPrepared: () => axios.get(`${DRV_BASE}/orders/prepared`, hdr(DRIVER_TOKEN)),
  drvPickup:   (id) => axios.patch(`${DRV_BASE}/orders/${mustId(id)}/pickup`,  {}, hdr(DRIVER_TOKEN)),
  drvDeliver:  (id) => axios.patch(`${DRV_BASE}/orders/${mustId(id)}/deliver`, {}, hdr(DRIVER_TOKEN)),
};