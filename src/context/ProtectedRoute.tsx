import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "../services/paths";
type Role = "Manager" | "Employee";

type ProtectedRouteProps = {
  children: React.ReactNode;
    allowedRoles?: Role[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children ,allowedRoles }) => {
 const location = useLocation();
  const token = localStorage.getItem("token");
    

    if (!token) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
  }


  return <>{children}</>;
};

export default ProtectedRoute;