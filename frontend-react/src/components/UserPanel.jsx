import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import StatusPill from "./StatusPill";
import Empty from "./Empty";

export default function UserPanel() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState("m1,m3");
  const [cancelId, setCancelId] = useState("");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadMenu = async () => {
    const res = await api.menu().catch(err => console.error("Menu API error:", err));
    setMenu(res?.data || []);
  };
  const loadOrders = async () => {
    const res = await api.orders().catch(err => console.error("Orders API error:", err));
    setOrders(res?.data || []);
  };

  useEffect(() => { loadMenu(); loadOrders(); }, []);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const parsed = items.split(",").map(s => s.trim()).filter(Boolean).map(id => ({ id }));
      const r = await api.create({ items: parsed, userId: "user-1" });
      setOut(r.data); await loadOrders();
    } finally { setLoading(false); }
  };

  const cancel = async () => {
    setLoading(true);
    try {
      const r = await api.cancel(cancelId.trim());
      setOut(r.data); await loadOrders();
    } finally { setLoading(false); }
  };

  return (
    <div className="card">
      <h2>👤 User</h2>

      <div className="section">
        <h3>Menu</h3>
        {menu.length ? (
          <div className="menu-grid">
            {menu.map((m) => (
              <div key={m.id} className="menu-item">
                <span>{m.name}</span>
                <small>₹{m.price}</small>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No menu items" subtitle="Click refresh to fetch menu" />
        )}
        <div className="controls" style={{marginTop: 8}}>
          <button className="btn" onClick={loadMenu}>Refresh Menu</button>
        </div>
      </div>

      <div className="section">
        <h3>Place Order</h3>
        <div className="controls">
          <input className="input" placeholder="Enter items (e.g., m1,m3)" value={items} onChange={(e)=>setItems(e.target.value)} />
          <button className="btn btn-primary" onClick={placeOrder} disabled={loading}>{loading ? "Placing..." : "Place Order"}</button>
        </div>
        <div className="footer-note">Tip: IDs are from the menu list above (m1, m2, m3)</div>
      </div>

      <div className="section">
        <h3>Cancel Order</h3>
        <div className="controls">
          <input className="input" placeholder="Enter Order ID" value={cancelId} onChange={(e)=>setCancelId(e.target.value)} />
          <button className="btn btn-danger" onClick={cancel} disabled={loading}>{loading ? "Cancelling..." : "Cancel (Pending Only)"}</button>
        </div>
      </div>

      <div className="section">
        <h3>My Orders</h3>
        {orders.length ? (
          <div className="orders">
            {orders.map((o) => (
              <div key={o.id} className="order-card">
                <div>
                  <div><strong>#{o.id}</strong></div>
                  <div className="order-id">Items: {o.items?.map(i => i.id).join(", ") || "-"}</div>
                </div>
                <StatusPill status={o.status} />
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No orders yet" subtitle="Place your first order to see it here" />
        )}
      </div>

      {out && (
        <div className="section">
          <h3>Response</h3>
          <pre>{JSON.stringify(out, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
