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
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  SparklesIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Settings } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    getConversations,
    users,
    conversations,
    selectedUser,
    selectedConversation,
    setSelectedUser,
    setSelectedConversation,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("conversations");
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  const filteredConversations = input
    ? conversations.filter((conversation) => {
        if (conversation.isGroup) {
          return conversation.groupName?.toLowerCase().includes(input.toLowerCase());
        } else {
          // For individual conversations, search by participant name
          const otherParticipant = conversation.participants.find(
            p => p._id !== authUser._id
          );
          return otherParticipant?.fullName.toLowerCase().includes(input.toLowerCase());
        }
      })
    : conversations;

  useEffect(() => {
    if (activeTab === "conversations") {
      getConversations();
    } else {
      getUsers();
    }
  }, [onlineUsers, activeTab]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedConversation(null);
    setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setSelectedUser(null);
    
    if (conversation.isGroup) {
      setUnseenMessages((prev) => ({ ...prev, [conversation._id]: 0 }));
    } else {
      const otherParticipant = conversation.participants.find(
        p => p._id !== authUser._id
      );
      if (otherParticipant) {
        setUnseenMessages((prev) => ({ ...prev, [otherParticipant._id]: 0 }));
      }
    }
  };

  const getConversationName = (conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName || "Group Chat";
    } else {
      const otherParticipant = conversation.participants.find(
        p => p._id !== authUser._id
      );
      return otherParticipant?.fullName || "Unknown User";
    }
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.isGroup) {
      return conversation.groupImage || assets.group_icon || assets.avatar_icon;
    } else {
      const otherParticipant = conversation.participants.find(
        p => p._id !== authUser._id
      );
      return otherParticipant?.profilePic || assets.avatar_icon;
    }
  };

  const getUnseenCount = (conversation) => {
    if (conversation.isGroup) {
      return unseenMessages[conversation._id] || 0;
    } else {
      const otherParticipant = conversation.participants.find(
        p => p._id !== authUser._id
      );
      return otherParticipant ? unseenMessages[otherParticipant._id] || 0 : 0;
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const isConversationOnline = (conversation) => {
    if (conversation.isGroup) {
      // For groups, check if any participant is online
      return conversation.participants.some(p => 
        p._id !== authUser._id && isUserOnline(p._id)
      );
    } else {
      const otherParticipant = conversation.participants.find(
        p => p._id !== authUser._id
      );
      return otherParticipant ? isUserOnline(otherParticipant._id) : false;
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">TalkDesk</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/create-group")}>
                <UsersIcon className="w-4 h-4 mr-2" />
                Create Group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="conversations" className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Recent Conversations
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate("/create-group")}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const unseenCount = getUnseenCount(conversation);
                const isSelected = selectedConversation?._id === conversation._id;
                const isOnline = isConversationOnline(conversation);

                return (
                  <div
                    key={conversation._id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={getConversationAvatar(conversation)} />
                        <AvatarFallback>
                          {conversation.isGroup ? (
                            <UsersIcon className="h-5 w-5" />
                          ) : (
                            getConversationName(conversation)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {getConversationName(conversation)}
                        </p>
                        {unseenCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </Badge>
                        )}
                      </div>
                      {conversation.isGroup && (
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.participants.length} members
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <UsersIcon className="h-8 w-8 mb-2" />
                <p className="text-sm">No conversations yet</p>
                <Button
                  variant="link"
                  className="text-xs"
                  onClick={() => navigate("/create-group")}
                >
                  Create a group
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users" className="flex-1 overflow-hidden">
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Available Users
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const unseenCount = unseenMessages[user._id] || 0;
                const isSelected = selectedUser?._id === user._id;
                const isOnline = isUserOnline(user._id);

                return (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
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
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {user.fullName}
                        </p>
                        {unseenCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <UserIcon className="h-8 w-8 mb-2" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
