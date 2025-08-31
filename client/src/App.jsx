import React, { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import FriendsPage from "./pages/FriendsPage";
import Loader from "./components/Loader";

const App = () => {
  const { authUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000); 
    return () => clearTimeout(timer);
  }, [])

  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <Toaster />
        <Routes>
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={authUser ? <MainLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="friends" element={<FriendsPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
