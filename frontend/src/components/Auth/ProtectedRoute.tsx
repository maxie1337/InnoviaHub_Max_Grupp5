import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";

//Protected route, only available for logged in users
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  //Checks if user is logged in from usercontext
  const { isAuthenticated } = useContext(UserContext);

  //If user is not logged in, send to loginpage
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //Otherwise, show content (Set in routing)
  return children;
}