import React, { useContext } from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { Context } from "../context/context";
const Dashboard = () => {
  const context = useContext(Context);

  return (
    <>
      <Navbar />

      <main>
        <div
          className={`${
            context?.isClosed ? "closed" : ""
          }  dashboard-container`}
        >
          <div className="container">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
