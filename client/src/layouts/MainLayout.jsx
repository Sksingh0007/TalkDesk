import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen  justify-center">
      <div className="w-16 flex flex-col items-center mt-4 gap-2">
        <ModeToggle />
        <div className="w-full aspect-square bg-gray-400 rounded" />
        <div className="w-full aspect-square bg-gray-500 rounded" />
        <div className="w-full aspect-square bg-gray-600 rounded" />
      </div>
      <div className="flex-1 h-[97vh] w-full m-2 flex border rounded-lg p-0">
        <Sidebar />

        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
