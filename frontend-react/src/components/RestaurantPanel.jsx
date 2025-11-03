import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import StatusPill from "./StatusPill";
import Empty from "./Empty";

export default function RestaurantPanel(){
  const [pending, setPending] = useState([]);
  const [id, setId] = useState('');
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await api.restPending().catch(err => console.error("Rest Pending error:", err));
    setPending(res?.data || []);
  };
  useEffect(()=>{ load(); }, []);

  const accept = async ()=>{
    setLoading(true);
    try { const r = await api.restAccept(id.trim()); setOut(r.data); await load(); }
    finally { setLoading(false); }
  };
  const prepared = async ()=>{
    setLoading(true);
    try { const r = await api.restPrepared(id.trim()); setOut(r.data); await load(); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <h2>🍽️ Restaurant</h2>

      <div className="section">
        <h3>Pending Orders</h3>
        {pending.length ? (
          <div className="orders">
            {pending.map(o => (
              <div key={o.id} className="order-card">
                <div>
                  <div><strong>#{o.id}</strong></div>
                  <div className="order-id">Items: {o.items?.map(i => i.id).join(', ') || '-'}</div>
                </div>
                <StatusPill status={o.status} />
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No pending orders" subtitle="Orders will appear here when users place them" />
        )}
        <div className="controls" style={{marginTop: 8}}>
          <button className="btn" onClick={load}>Refresh Pending</button>
        </div>
      </div>

      <div className="section">
        <h3>Actions</h3>
        <div className="controls">
          <input className="input" placeholder="Order ID" value={id} onChange={e=>setId(e.target.value)} />
          <button className="btn btn-primary" onClick={accept} disabled={loading}>{loading ? "..." : "Accept"}</button>
          <button className="btn btn-warning" onClick={prepared} disabled={loading}>{loading ? "..." : "Mark Prepared"}</button>
        </div>
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
