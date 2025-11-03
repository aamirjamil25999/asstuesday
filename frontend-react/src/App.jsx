import React from "react";
import "./styles.css";
import Header from "./components/Header";
import UserPanel from "./components/UserPanel";
import RestaurantPanel from "./components/RestaurantPanel";
import DriverPanel from "./components/DriverPanel";

export default function App(){
  return (
    <div className="container">
      <Header />
      <div className="grid">
        <UserPanel />
        <RestaurantPanel />
        <DriverPanel />
      </div>
    </div>
  );
}
