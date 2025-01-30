import React, { useContext } from "react";
import { Context } from "../context/context";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminAuth = () => {
  const context = useContext(Context);
  const location = useLocation();
  return context.userDetails.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/dashboard/error-404"} />
  );
};

export default AdminAuth;
