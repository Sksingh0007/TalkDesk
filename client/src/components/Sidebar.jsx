import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets from "../assets/assets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SparklesIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Settings } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers, authUser } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <aside className="h-full w-72 bg-background p-2 flex flex-col">
      {/* Top Section */}
      <div className="pb-4 space-y-4">
        {/* Branding + Menu */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search user..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-10 w-fit  "
            />
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SparklesIcon className="h-6 w-6 text-primary cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-48 rounded-xl"
            >
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-sm"
              >
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        <hr />

        <div className="flex flex-col gap-2 w-full">
          <Button
            variant={"outline"}
            className="justify-start w-full rounded-xs"
          >
            Friend
          </Button>
          <Button
            variant={"outline"}
            className="justify-start w-full rounded-xs"
          >
            Group
          </Button>
        </div>
        <hr />
        {/* Search */}
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
              }}
              className="w-full justify-start gap-3 rounded-xs px-4 py-2 h-fit "
            >
              {/* Avatar with online dot */}
              <div className="relative">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={user?.profilePic || assets.avatar_icon} />
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

              {/* User name */}
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
      <div className="rounded-xs mt-2 p-2 bg-foreground/20 border-2 flex items-center justify-between px-2">
        {/* Avatar + Name */}
        <div className="flex items-center gap-2">
          <Avatar className="border w-10 h-10">
            <AvatarImage
              className=" rounded-full object-cover"
              src={authUser?.profilePic || assets.avatar_icon}
            />
            <AvatarFallback>
              {authUser?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-md font-medium leading-none capitalize">
              {authUser?.fullName}
            </p>
          </div>
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="w-8 h-8 " />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserIcon className="w-4 h-4 mr-2 text-muted-foreground" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:bg-destructive/10"
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
