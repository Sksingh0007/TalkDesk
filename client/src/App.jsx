import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import FriendsPage from "./pages/FriendsPage";

const App = () => {
  const { authUser } = useContext(AuthContext);

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
