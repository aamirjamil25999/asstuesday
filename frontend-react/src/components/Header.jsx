import React from "react";
export default function Header(){
  return (
    <div className="header">
      <div className="brand">
        <div className="logo">🍽️</div>
        <div>Food Order Lifecycle</div>
      </div>
      <div className="chips">
        <div className="chip">Order: 3001</div>
        <div className="chip">Restaurant: 3002</div>
        <div className="chip">Delivery: 3003</div>
      </div>
    </div>
  );
}
