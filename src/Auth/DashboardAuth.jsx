import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Context } from "../context/context";

const DashboardAuth = () => {
  const context = useContext(Context);
  const location = useLocation();

  return context?.userDetails.token ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/"} />
  );
};

export default DashboardAuth;
