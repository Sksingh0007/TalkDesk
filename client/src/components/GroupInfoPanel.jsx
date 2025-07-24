import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { 
  UserIcon, 
  PencilIcon, 
  UserPlusIcon, 
  UserMinusIcon,
  CrownIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import assets from "../assets/assets";
import toast from "react-hot-toast";

const GroupInfoPanel = ({ conversation, onClose }) => {
  const { authUser } = useContext(AuthContext);
  const { getUsers, users, updateGroupInfo, addGroupMember, removeGroupMember } = useContext(ChatContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(conversation?.groupName || "");
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = conversation?.groupAdmins?.includes(authUser._id);

  useEffect(() => {
    if (showAddMember) {
      getUsers();
    }
  }, [showAddMember]);

  // Get available users (not already in group)
  const currentMemberIds = conversation?.participants?.map(p => p._id) || [];
  const availableUsers = users.filter(user => 
    !currentMemberIds.includes(user._id) &&
    user.fullName.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleUpdateGroupName = async () => {
    if (editedName.trim() === "") {
      toast.error("Group name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await updateGroupInfo(conversation._id, { groupName: editedName.trim() });
      setIsEditing(false);
      toast.success("Group name updated successfully");
    } catch (error) {
      toast.error("Failed to update group name");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (userId) => {
    setIsLoading(true);
    try {
      await addGroupMember(conversation._id, userId);
      toast.success("Member added successfully");
      setShowAddMember(false);
      setSearchInput("");
    } catch (error) {
      toast.error("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (conversation.participants.length <= 2) {
      toast.error("Group must have at least 2 members");
      return;
    }

    setIsLoading(true);
    try {
      await removeGroupMember(conversation._id, userId);
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversation) return null;

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Group Info</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Group Avatar and Name */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={conversation.groupImage || assets.group_icon || assets.avatar_icon} />
            <AvatarFallback>
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>

          {isEditing ? (
            <div className="flex items-center space-x-2 w-full">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-center"
                disabled={isLoading}
              />
              <Button size="sm" onClick={handleUpdateGroupName} disabled={isLoading}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-medium text-center">{conversation.groupName}</h3>
              {isAdmin && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {conversation.participants?.length} members
          </p>
        </div>
      </div>

      {/* Members Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Members</h4>
            {isAdmin && (
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Members</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Search users..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {availableUsers.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No users available to add
                        </p>
                      ) : (
                        availableUsers.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profilePic || assets.avatar_icon} />
                                <AvatarFallback>
                                  {user.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.fullName}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddMember(user._id)}
                              disabled={isLoading}
                            >
                              Add
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Members List */}
          <div className="space-y-2">
            {conversation.participants?.map((member) => {
              const isMemberAdmin = conversation.groupAdmins?.includes(member._id);
              const isCurrentUser = member._id === authUser._id;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.profilePic || assets.avatar_icon} />
                      <AvatarFallback>
                        {member.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                          {member.fullName}
                          {isCurrentUser && " (You)"}
                        </p>
                        {isMemberAdmin && (
                          <Badge variant="secondary" className="text-xs">
                            <CrownIcon className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && !isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive"
                    >
                      <UserMinusIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Group Actions */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          {isAdmin ? (
            <Badge variant="default" className="w-full justify-center">
              <CrownIcon className="h-4 w-4 mr-2" />
              You are an admin
            </Badge>
          ) : (
            <Badge variant="secondary" className="w-full justify-center">
              Group Member
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupInfoPanel;