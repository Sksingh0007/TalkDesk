import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { ChatContext } from "../../context/ChatContext";
import { ModeToggle } from "@/components/ModeToggle";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="flex h-screen w-screen  justify-center">
      <div className="w-16 flex flex-col items-center mt-4 gap-2">
        <ModeToggle />
        <div className="w-full aspect-square bg-gray-400 rounded" />
        <div className="w-full aspect-square bg-gray-500 rounded" />
        <div className="w-full aspect-square bg-gray-600 rounded" />
      </div>
      <div className="flex-1 h-[97vh] w-full m-3 flex border rounded-sm  p-0">
        <div className=" flex w-full ">
          <Sidebar />
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
