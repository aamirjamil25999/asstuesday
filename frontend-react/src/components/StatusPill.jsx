import React from "react";
export default function StatusPill({ status }){
  if(!status) return null;
  const key = status.toLowerCase().replaceAll(' ', '_');
  return <span className={`pill ${key}`}>{status}</span>;
}
