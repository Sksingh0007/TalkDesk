import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

const RightSidebar = ({ isOpen }) => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  //Get all the images from the messages and store them to state
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    <>
      {isOpen && (
        <div className="w-[500px] h-full bg-sidebar border-l border-border overflow-y-auto">
          {/* Cover Section */}
          <div className="relative h-40 bg-accent rounded-r-sm">
            {/* Profile Image with Online Status Dot */}
            <div className="absolute left-4 -bottom-20">
              <div className="relative w-40 h-40">
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-40 h-40 rounded-full object-cover border-4 border-muted shadow-md"
                />
                <span
                  className={`absolute bottom-3 right-5 w-5 h-5 rounded-full border-2 border-muted ${
                    onlineUsers.includes(selectedUser?._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Name (no dot here anymore) */}
          <div className="pt-25 pl-4 pr-4 bf">
            <h2 className="text-2xl font-semibold text-primary">
              {selectedUser?.fullName}
            </h2>
          </div>

          {/* About Box */}
          <div className="mt-4 px-4">
            <div className="rounded-lg border bg-muted-foreground/10 p-4 shadow-sm">
              <h3 className="text-sm font-medium  mb-2">About</h3>
              <p className="text-sm text-muted-foreground ">
                {selectedUser?.bio || "No bio provided."}
              </p>
            </div>
          </div>

          {/* Media Box */}
          <div className="mt-4 px-4">
            <div className="rounded-lg border h-[46vh] bg-muted-foreground/10 p-4 shadow-sm">
              <h3 className="text-sm font-medium  mb-2">Media</h3>
              {msgImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 h-[38vh] overflow-y-auto pr-1">
                  {msgImages.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      onClick={() => window.open(url)}
                      className="rounded-md object-cover w-full h-32  cursor-pointer"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No media found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RightSidebar;
