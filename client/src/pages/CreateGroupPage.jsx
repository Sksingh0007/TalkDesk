import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import assets from "../assets/assets";
import toast from "react-hot-toast";

const CreateGroupPage = () => {
  const { createGroupChat, getUsers, users } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([authUser._id]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      await getUsers();
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      toast.error("Group name is required.");
      return;
    }
    if (selectedUsers.length < 2) {
      toast.error("Please select at least one other member.");
      return;
    }
    
    setIsLoading(true);
    try {
      await createGroupChat({ name: groupName, participants: selectedUsers });
      toast.success("Group created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchInput.toLowerCase()) &&
    user._id !== authUser._id
  );

  return (
    <div className="flex flex-col h-full w-full p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create Group Chat</h1>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Cancel
        </Button>
      </div>
      
      <Input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="mb-4"
        disabled={isLoading}
      />
      
      <Input
        type="text"
        placeholder="Search users..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="mb-4"
        disabled={isLoading}
      />
      
      {selectedUsers.length > 1 && (
        <div className="mb-4 p-2 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Selected members ({selectedUsers.length - 1}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedUsers
              .filter(id => id !== authUser._id)
              .map(userId => {
                const user = users.find(u => u._id === userId);
                return user ? (
                  <span key={userId} className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                    {user.fullName}
                  </span>
                ) : null;
              })
            }
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-muted-foreground">
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user._id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUsers.includes(user._id) 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80"
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
              <div className="flex-1">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              {selectedUsers.includes(user._id) && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <Button 
        onClick={handleCreateGroup} 
        className="mt-4"
        disabled={isLoading || groupName.trim() === "" || selectedUsers.length < 2}
      >
        {isLoading ? "Creating..." : `Create Group (${selectedUsers.length - 1} members)`}
      </Button>
    </div>
  );
};

export default CreateGroupPage;
