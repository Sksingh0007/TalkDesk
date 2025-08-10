import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets from "../assets/assets";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

import {
  SparklesIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Settings } from "lucide-react";

const Sidebar = () => {
  const { selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } =
    useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch friends for sidebar
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/friends/list", {
          headers: { token },
        });
        setFriends(res.data.friends || []);
      } catch {
        console.error("Failed to fetch friends");
      }
    };
    fetchFriends();
    // Listen for friend list changes
    const handler = () => fetchFriends();
    window.addEventListener("friendListChanged", handler);
    return () => window.removeEventListener("friendListChanged", handler);
  }, [onlineUsers]);

  // WhatsApp-like sorting: most recent chat (sent or received) on top
  const sortedUsers = [...friends].sort((a, b) => {
    // If both have lastMessage, compare by createdAt
    if (a.lastMessage && b.lastMessage) {
      return (
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      );
    }
    // If only one has lastMessage, that one comes first
    if (a.lastMessage) return -1;
    if (b.lastMessage) return 1;
    // Fallback: compare by updatedAt (user creation date)
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const filteredUsers = input
    ? sortedUsers.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : sortedUsers;

  return (
    <aside className="h-full w-72 bg-background p-2 flex flex-col ">
      {/* Top Section */}
      <div className="pb-4 space-y-4">
        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search user..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <hr />

        {/* Friend / Group Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <Button
            variant="outline"
            className="justify-start w-full rounded-xs cursor-pointer"
            onClick={() => navigate("/friends")}
          >
            Friend
          </Button>
          <Button
            variant="outline"
            className="justify-start w-full rounded-xs cursor-pointer"
          >
            Group
          </Button>
        </div>

        <hr />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const hasUnseen = unseenMessages[user._id] > 0;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <Button
              key={user._id}
              variant={isSelected ? "selected" : "outline"}
              onClick={() => {
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
                setSelectedUser(user);
                navigate("/");
              }}
              className="w-full justify-start gap-2 py-0.5 rounded-xs h-fit cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative cursor-pointer">
                <Avatar className="h-10 w-10 border cursor-pointer ">
                  <AvatarImage
                    src={user?.profilePic || assets.avatar_icon}
                    className="object-cover w-10 h-10"
                  />
                  <AvatarFallback>
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-background ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              {/* Name */}
              <div className="flex flex-1 flex-col items-start justify-center">
                <p className="text-sm font-medium">{user.fullName}</p>
              </div>

              {/* Unread badge */}
              {hasUnseen && (
                <div className="min-w-5 h-5 px-1 text-[10px] rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {unseenMessages[user._id]}
                </div>
              )}
            </Button>
          );
        })}
      </div>
      <hr />
      {/* Current User Info + Dropdown */}
      <div className="rounded-xs mt-2 p-2 bg-card border-2 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar className="h-10 w-10 border cursor-pointer">
            <AvatarImage
              src={authUser?.profilePic || assets.avatar_icon}
              className="object-cover h-10 w-10"
            />
            <AvatarFallback>
              {authUser.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-md font-medium leading-none capitalize">
              {authUser?.fullName}
            </p>
          </div>
        </div>

        {/* Settings dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
            >
              <Settings className="w-8 h-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              <UserIcon className="w-4 h-4 mr-2 text-muted-foreground" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;
