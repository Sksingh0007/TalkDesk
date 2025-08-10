import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { FaPlus, FaRegSmile, FaCheck, FaCheckDouble } from "react-icons/fa";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { IoSendSharp } from "react-icons/io5";
import { Button } from "./ui/button";
import RightSidebar from "./RightSidebar";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //Handle emoji click function
  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  //Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  //Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const inputElement = e.target; //save the input element for reference

    const reader = new FileReader();

    reader.onloadend = async (e) => {
      if (!e.target.result) return;
      await sendMessage({ image: reader.result });
      inputElement.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="flex h-full w-full relative bg-card ">
      {/* Header */}
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt="user-img"
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="flex-1 text-sm font-medium flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </p>
          <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="back"
            className="md:hidden w-6 h-6 cursor-pointer"
          />
          <Button
            variant="outline"
            className="rounded-xs cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            Media
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
          {messages?.map((msg, index) => {
            const isSelf = msg.senderId === authUser._id;
            const nextMsg = messages[index + 1];
            const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

            return (
              <div
                key={msg._id}
                className={`flex gap-2 mb-2 ${
                  isSelf ? "justify-end" : "justify-start"
                } items-end`}
              >
                {/* LEFT SIDE: Avatar or placeholder */}
                {!isSelf && (
                  <div className="flex flex-col items-center text-xs text-muted-foreground w-6">
                    {isLastInGroup ? (
                      <Avatar>
                        <AvatarImage
                          src={selectedUser?.profilePic || assets.avatar_icon}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 invisible" /> // Invisible placeholder
                    )}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`relative flex gap-1 px-3 py-2 pr-15 text-sm rounded-lg max-w-[60%] break-words ${
                    isSelf ? "bg-primary text-white" : "bg-gray-300 text-black"
                  } ${isSelf ? "rounded-br-none" : "rounded-bl-none"}`}
                >
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt="Sent image"
                      className="rounded-md max-w-full object-cover"
                    />
                  ) : (
                    <span>{msg.text}</span>
                  )}

                  {/* Time and tick icons */}
                  <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] text-muted">
                    <span>{formatMessageTime(msg.createdAt)}</span>
                    {isSelf &&
                      (msg.seen ? (
                        <FaCheckDouble
                          className="text-green-900 ml-1"
                          title="Seen"
                        />
                      ) : (
                        <FaCheck className="text-white ml-1" title="Sent" />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={scrollEnd} />
        </div>

        {/* Bottom Input Bar */}
        <div className="border-t px-3 py-2 flex items-center gap-2 ">
          {/* Input area with attachment, text, emoji */}
          <div className="flex items-center px-3 py-1 rounded-full flex-1  gap-3">
            {/* Attachment icon */}
            <label htmlFor="image" className="cursor-pointer">
              <Input
                onChange={handleSendImage}
                type="file"
                id="image"
                accept="image/png,image/jpeg"
                hidden
              />
              <FaPlus className="text-muted-foreground w-6 h-6" />
            </label>

            {/* Text input */}
            <Input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
              type="text"
              placeholder="Type a message"
              className="flex-1 bg-muted border-2 border-background "
            />

            {/* Emoji picker toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              <FaRegSmile className="text-muted-foreground w-6 h-6" />
            </button>
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSendMessage}
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <IoSendSharp className="text-muted-foreground w-6 h-6" />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 z-50 rounded-lg border shadow-md bg-popover max-h-[300px] overflow-y-auto w-[280px]">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              height={300}
              width={280}
            />
          </div>
        )}
      </div>
      <div>
        <RightSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  ) : (
    <div className=" w-full flex flex-col items-center justify-center gap-2 bg-card">
      <img
        onClick={handleSendMessage}
        src={assets.logo_icon}
        alt=""
        className="max-w-16"
      />
      <p className="text-lg font-medium">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
