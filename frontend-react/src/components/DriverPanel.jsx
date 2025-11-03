import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import StatusPill from "./StatusPill";
import Empty from "./Empty";

export default function DriverPanel(){
  const [prepared, setPrepared] = useState([]);
  const [id, setId] = useState('');
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await api.drvPrepared().catch(err => console.error("Drv Prepared error:", err));
    setPrepared(res?.data || []);
  };
  useEffect(()=>{ load(); }, []);

  const pickup = async ()=>{
    setLoading(true);
    try { const r = await api.drvPickup(id.trim()); setOut(r.data); await load(); }
    finally { setLoading(false); }
  };
  const deliver = async ()=>{
    setLoading(true);
    try { const r = await api.drvDeliver(id.trim()); setOut(r.data); await load(); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <h2>🚚 Driver</h2>

      <div className="section">
        <h3>Prepared Orders</h3>
        {prepared.length ? (
          <div className="orders">
            {prepared.map(o => (
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
          <Empty title="Nothing to pick up" subtitle="Prepared orders will show up here" />
        )}
        <div className="controls" style={{marginTop: 8}}>
          <button className="btn" onClick={load}>Refresh Prepared</button>
        </div>
      </div>

      <div className="section">
        <h3>Actions</h3>
        <div className="controls">
          <input className="input" placeholder="Order ID" value={id} onChange={e=>setId(e.target.value)} />
          <button className="btn btn-success" onClick={pickup} disabled={loading}>{loading ? "..." : "Pick Up"}</button>
          <button className="btn btn-primary" onClick={deliver} disabled={loading}>{loading ? "..." : "Deliver"}</button>
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
