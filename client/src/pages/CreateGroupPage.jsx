import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import assets from "../assets/assets";
import toast from "react-hot-toast";

const CreateGroupPage = () => {
  const { createGroupChat, users } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([authUser._id]);
  const navigate = useNavigate();

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === "" || selectedUsers.length < 2) {
      toast.error("Group name and at least one other member are required.");
      return;
    }
    await createGroupChat({ name: groupName, participants: selectedUsers });
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full w-full p-4 bg-card">
      <h1 className="text-2xl font-bold mb-4">Create Group Chat</h1>
      <Input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="mb-4"
      />
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {Array.isArray(users) && users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user._id)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              selectedUsers.includes(user._id) ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user?.profilePic || assets.avatar_icon} />
              <AvatarFallback>
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{user.fullName}</p>
          </div>
        ))}
      </div>
      <Button onClick={handleCreateGroup} className="mt-4">
        Create Group
      </Button>
    </div>
  );
};

export default CreateGroupPage;
