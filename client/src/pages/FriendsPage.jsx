import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatContext } from "../../context/ChatContext";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  MessageCircle,
  UserPlus2,
  X,
  Check,
  Trash2,
  Undo2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import assets from "../assets/assets";

// Combined Requests Tab Component (Incoming + Sent)
const RequestsTab = () => {
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // userId for which action is loading

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [incomingRes, sentRes] = await Promise.all([
        axios.get("/api/friends/requests", { headers: { token } }),
        axios.get("/api/friends/sent", { headers: { token } }),
      ]);
      setIncoming(incomingRes.data.friendRequests || []);
      setSent(sentRes.data.sentRequests || []);
      window.dispatchEvent(new Event("friendListChanged"));
    } catch (err) {
      toast.error("Failed to fetch requests");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRequests();
    const handler = () => fetchRequests();
    window.addEventListener("friendListChanged", handler);
    return () => window.removeEventListener("friendListChanged", handler);
  }, []);

  const handleAction = async (userId, action) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/friends/${action}`,
        { fromUserId: userId },
        { headers: { token } }
      );
      setIncoming((prev) => prev.filter((req) => req._id !== userId));
      toast.success(`Request ${action === "accept" ? "accepted" : "rejected"}`);
      window.dispatchEvent(new Event("friendListChanged"));
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsend = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/friends/unsend",
        { toUserId: userId },
        { headers: { token } }
      );
      setSent((prev) => prev.filter((u) => u._id !== userId));
      toast.success("Friend request unsent");
      window.dispatchEvent(new Event("friendListChanged"));
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to unsend friend request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-2 rounded-sm bg-card">
      <div className="flex flex-col gap-6">
        <div>
          <div className="font-semibold mb-2 text-primary">
            Incoming Requests
          </div>
          {loading && (
            <div className="text-center text-muted-foreground">Loading...</div>
          )}
          {!loading && incoming.length === 0 && (
            <div className="text-muted-foreground text-center py-2">
              No incoming requests.
            </div>
          )}
          <AnimatePresence>
            {incoming.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center gap-3 p-2 bg-foreground/10 rounded-sm shadow-sm border mb-2"
              >
                <Avatar className="h-10 w-10 border-2">
                  <AvatarImage
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="rounded-full fill object-cover"
                  />
                  <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span className="font-medium flex-1">{user.fullName}</span>
                <button
                  className="p-2 rounded-full border border-primary text-primary bg-primary/10 hover:bg-primary/20 transition disabled:opacity-50 flex items-center justify-center"
                  disabled={actionLoading === user._id}
                  title="Accept"
                  onClick={() => handleAction(user._id, "accept")}
                >
                  {actionLoading === user._id ? (
                    <span className="w-4 h-4 animate-spin border-2 border-primary border-t-transparent rounded-full inline-block" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                </button>
                <button
                  className="p-2 rounded-full border border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20 transition disabled:opacity-50 flex items-center justify-center"
                  disabled={actionLoading === user._id}
                  title="Reject"
                  onClick={() => handleAction(user._id, "reject")}
                >
                  {actionLoading === user._id ? (
                    <span className="w-4 h-4 animate-spin border-2 border-destructive border-t-transparent rounded-full inline-block" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div>
          <div className="font-semibold mb-2 text-primary">Sent Requests</div>
          {!loading && sent.length === 0 && (
            <div className="text-muted-foreground text-center py-2">
              No sent requests.
            </div>
          )}
          <AnimatePresence>
            {sent.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center gap-3 p-2 bg-foreground/10 rounded-sm shadow-sm border mb-2"
              >
                <Avatar className="h-10 w-10 border-2">
                  <AvatarImage
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="rounded-full fill object-cover"
                  />
                  <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span className="font-medium flex-1">{user.fullName}</span>
                <button
                  className="p-2 rounded-full border border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20 transition disabled:opacity-50 flex items-center justify-center"
                  disabled={actionLoading === user._id}
                  title="Unsend"
                  onClick={() => handleUnsend(user._id)}
                >
                  {actionLoading === user._id ? (
                    <span className="w-4 h-4 animate-spin border-2 border-destructive border-t-transparent rounded-full inline-block" />
                  ) : (
                    <Undo2 className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Add Friends Tab Component
const AddFriendsTab = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentTo, setSentTo] = useState([]); // users to whom I sent requests

  const fetchFriendsAndRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const [friendsRes, requestsRes, sentRes] = await Promise.all([
        axios.get("/api/friends/list", { headers: { token } }),
        axios.get("/api/friends/requests", { headers: { token } }),
        axios.get("/api/friends/sent", { headers: { token } }),
      ]);
      setFriends(friendsRes.data.friends?.map((f) => f._id) || []);
      setSentRequests(requestsRes.data.friendRequests?.map((u) => u._id) || []);
      setSentTo(sentRes.data.sentRequests?.map((u) => u._id) || []);
    } catch {
      console.error("Failed to fetch friends and requests");
    }
  };

  useEffect(() => {
    fetchFriendsAndRequests();
    const handler = () => fetchFriendsAndRequests();
    window.addEventListener("friendListChanged", handler);
    return () => window.removeEventListener("friendListChanged", handler);
  }, []);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/friends/search?query=${encodeURIComponent(e.target.value)}`,
        { headers: { token } }
      );
      setResults(res.data.users || []);
    } catch (err) {
      toast.error("Failed to search users");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/friends/send",
        { toUserId: userId },
        { headers: { token } }
      );
      setSentRequests((prev) => [...prev, userId]);
      toast.success("Friend request sent");
      window.dispatchEvent(new Event("friendListChanged"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="p-2 rounded-sm bg-card">
      <div className="relative mb-3">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search users by name or email..."
          value={search}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>
      <div className="flex flex-col gap-2">
        {loading && (
          <div className="text-center text-muted-foreground">Searching...</div>
        )}
        {!loading && results.length === 0 && search && (
          <div className="text-muted-foreground text-center py-4">
            No users found.
          </div>
        )}
        <AnimatePresence>
          {results
            .filter(
              (user) =>
                !sentRequests.includes(user._id) &&
                !friends.includes(user._id) &&
                !sentTo.includes(user._id)
            )
            .map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center gap-3 p-2 bg-foreground/10 rounded-sm shadow-sm border"
              >
                <Avatar className="h-10 w-10 border-2">
                  <AvatarImage
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="rounded-full fill object-cover"
                  />
                  <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span className="font-medium flex-1">{user.fullName}</span>
                <button
                  className="p-2 rounded-full border border-primary text-primary bg-primary/10 hover:bg-primary/20 transition flex items-center justify-center"
                  title="Send Friend Request"
                  onClick={() => sendRequest(user._id)}
                >
                  <UserPlus2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FriendsPage = () => {
  const { setSelectedUser } = useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/friends/list", {
          headers: { token },
        });
        setFriends(res.data.friends || []);
      } catch {
        toast.error("Failed to fetch friends");
      }
    };
    fetchFriends();
    const handler = () => fetchFriends();
    window.addEventListener("friendListChanged", handler);
    return () => window.removeEventListener("friendListChanged", handler);
  }, []);

  const handleRemoveFriend = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/friends/remove",
        { friendId: userId },
        { headers: { token } }
      );
      setFriends((prev) => prev.filter((u) => u._id !== userId));
      toast.success("Friend removed");
      window.dispatchEvent(new Event("friendListChanged"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove friend");
    }
  };

  const filteredUsers = friends.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col bg-card p-2">
      <Tabs defaultValue="all" className="flex flex-col h-full">
        <TabsList className="mb-2 rounded-xs border ">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="add">Add Friends</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="p-2 rounded-xs bg-card">
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              {filteredUsers.length === 0 && (
                <div className="text-muted-foreground text-center py-4">
                  No users found.
                </div>
              )}
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className="flex items-center gap-1 p-2 bg-foreground/10 rounded-sm shadow-sm border"
                  >
                    <Avatar className="h-10 w-10 border-2">
                      <AvatarImage
                        className={"fill object-cover"}
                        src={user.profilePic || assets.avatar_icon}
                        alt={user.fullName}
                      />
                      <AvatarFallback>
                        {user.fullName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium flex-1">{user.fullName}</span>
                    <button
                      className="p-2 rounded-full border border-primary text-primary bg-primary/10 hover:bg-primary/20 transition flex items-center justify-center"
                      title="Message"
                      onClick={() => {
                        setSelectedUser(user);
                        navigate("/");
                      }}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-full border border-destructive text-destructive bg-destructive/10 hover:bg-destructive/20 transition flex items-center justify-center"
                      title="Remove Friend"
                      onClick={() => handleRemoveFriend(user._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="add">
          <AddFriendsTab />
        </TabsContent>
        <TabsContent value="requests">
          <RequestsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsPage;
