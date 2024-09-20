import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import App from "./App";
import SignUp from "@/components/SignUp";
import SignIn from "@/components/SignIn";

const AppRoutes = () => {
  const { isSignedIn } = useAuth();

  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route
        path="/*"
        element={isSignedIn ? <App /> : <Navigate to="/sign-in" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
