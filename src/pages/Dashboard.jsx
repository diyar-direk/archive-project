import React, { useContext } from "react";

import { Outlet } from "react-router-dom";
import { Context } from "../context/context";
import Navbar from "./../components/navbar/Navbar";
const Dashboard = () => {
  const context = useContext(Context);
  const closeAside = () => {
    const nav = document.querySelector("nav");
    nav && nav.classList.toggle("closed");
    localStorage.setItem("isClosed", nav.classList.contains("closed"));
    context?.setIsClosed(nav.classList.contains("closed"));
  };
  return (
    <>
      <div className="progres">
        <div className="relative">
          <h4></h4>
          <span></span>
        </div>
      </div>
      <Navbar />

      <main>
        <div
          className={`relative ${
            context?.isClosed ? "closed" : ""
          } dashboard-container`}
        >
          <div onClick={closeAside} className="center open-aside">
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          <div className="container">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
