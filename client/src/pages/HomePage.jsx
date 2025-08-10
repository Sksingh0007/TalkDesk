import React from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { ChatContext } from "../../context/ChatContext";
import { ModeToggle } from "@/components/ModeToggle";

const HomePage = () => {
  return (
    <div className=" flex w-full h-full ">
      <ChatContainer />
    </div>
  );
};

export default HomePage;
