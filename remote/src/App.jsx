import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./home";
import Customer from "./Customer";

const App = () => {
  return (
    <div className="container">
      <div className="app_bar">
        <div className="menu">
          <div
            className="menu_item"
            onClick={() => {
              window.location.href = `/home`;
            }}
          >
            Home
          </div>
          <div
            className="menu_item"
            onClick={() => {
              window.location.href = `/customer`;
            }}
          >
            Customer
          </div>
        </div>
      </div>
      <div className="app_body">
        <BrowserRouter>
          <Routes>
            <Route exact element={<Navigate to="/home" />} path="/" />
            <Route exact element={<Home />} path="/home" />
            <Route exact element={<Customer />} path="/customer" />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
