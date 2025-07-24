import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();


export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({})

    const { socket, axios } = useContext(AuthContext);

    //function to get users for sidebar (backward compatibility)
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users')
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
                console.log("Unseen from server:", data.unseenMessages);

            }  
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get conversations and users for sidebar (supports groups)
    const getConversations = async () => {
        try {
            const { data } = await axios.get('/api/messages/conversations')
            if (data.success) {
                setConversations(data.conversations)
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
                console.log("Conversations from server:", data.conversations);
                console.log("Unseen from server:", data.unseenMessages);
            }  
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to get messages for selected user (backward compatibility)
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
        
    }

    //Function to get messages for selected conversation (supports groups)
    const getConversationMessages = async (conversationId) => {
        try {
            const { data } = await axios.get(`/api/messages/conversation/${conversationId}`)
            if (data.success) {
                setMessages(data.messages);
                return data.conversation;
            }
            
        } catch (error) {
            toast.error(error.message);
        }
        
    }

    //Function to send message to selected user (backward compatibility)
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages)=> [...(prevMessages || []), data.newMessage])
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to send message to selected conversation (supports groups)
    const sendConversationMessage = async (messageData) => {
        try {
            const conversationId = selectedConversation?._id;
            if (!conversationId) {
                toast.error("No conversation selected");
                return;
            }
            
            const { data } = await axios.post(`/api/messages/conversation/${conversationId}`, messageData);
            if (data.success) {
                setMessages((prevMessages)=> [...(prevMessages || []), data.newMessage])
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to create group chat
    const createGroupChat = async (groupData) => {
        try {
            const { data } = await axios.post('/api/conversations/create-group', groupData);
            if (data.success) {
                toast.success("Group created successfully!");
                getConversations(); // Refresh conversations
                return data.conversation;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
      if (!socket) return;

      socket.on("newMessage", (newMessage) => {
        // Handle individual chat messages
        if (selectedUser && newMessage.senderId === selectedUser?._id) {
          newMessage.seen = true;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          axios.put(`/api/messages/mark/${newMessage._id}`);
        } 
        // Handle group chat messages
        else if (selectedConversation && newMessage.conversationId === selectedConversation?._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } 
        // Update unseen count for other conversations
        else {
          if (newMessage.conversationId) {
            // Group message
            setUnseenMessages((prevUnseenMessages) => ({
              ...prevUnseenMessages,
              [newMessage.conversationId]: prevUnseenMessages[newMessage.conversationId]
                ? prevUnseenMessages[newMessage.conversationId] + 1
                : 1,
            }));
          } else {
            // Individual message
            setUnseenMessages((prevUnseenMessages) => ({
              ...prevUnseenMessages,
              [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                ? prevUnseenMessages[newMessage.senderId] + 1
                : 1,
            }));
          }
        }
      });
      
      // Listen for unseen update from server
      socket.on("updateUnseen", () => {
        console.log("Received updateUnseen socket event");
        getConversations(); // re-fetch conversations to get updated unseen messages
      });
    }

    //Function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage")
    }
    
    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    },[socket, selectedUser, selectedConversation])

    const value = {
        messages,
        users,
        conversations,
        selectedUser,
        selectedConversation,
        unseenMessages,
        getUsers,
        getConversations,
        getMessages,
        getConversationMessages,
        setMessages,
        sendMessage,
        sendConversationMessage,
        createGroupChat,
        setSelectedUser,
        setSelectedConversation,
        setUnseenMessages

    }

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}