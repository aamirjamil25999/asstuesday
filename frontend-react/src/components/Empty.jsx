import React from "react";
export default function Empty({ title="Nothing here", subtitle="Try refreshing or perform an action." }){
  return (
    <div className="empty">
      <strong>{title}</strong>
      <div className="footer-note">{subtitle}</div>
    </div>
  );
}
