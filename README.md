# TalkDesk – Real-time Chat App

A sleek and modern full-stack chat application with real-time messaging, custom profiles, and unseen message tracking. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js), enhanced by **Socket.IO** for real-time communication, and styled with **Tailwind CSS + ShadCN UI**.

---

## Features

- **Secure Authentication** – Signup/Login with JWT
- **Instant Messaging** – Real-time 1:1 chats using Socket.IO
- **Online Status** – Live user presence indicator
- **Media Support** – Upload images via Cloudinary
- **Unseen Message Tracking** – Never miss a message
- **User Profiles** – Update bio, name & avatar
- Responsive, themed UI with `Heroicons` and `ShadCN`

---

## Tech Stack

| Layer        | Tech                                  |
|--------------|----------------------------------------|
| Frontend     | React, Tailwind CSS, ShadCN UI, Heroicons |
| Backend      | Node.js, Express                      |
| Database     | MongoDB, Mongoose                     |
| Real-time    | Socket.IO                             |
| File Upload  | Cloudinary                            |
| Auth         | JWT (JSON Web Tokens)                 |

---

## Project Structure

```
root/
├── client/              # React frontend
│   ├── pages/
│   ├── components/
│   └── ...
├── server/              # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── .env
├── package.json
└── README.md
```

---

## Frontend (React)

```bash
cd client
npm install
npm start
```

---

## Backend (Node.js + Express)

```bash
cd server
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `server` folder and add the following:

```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Scripts

**Frontend:**

```bash
npm run dev         # Start React development server
```

**Backend:**

```bash
npm run dev         # Start backend with nodemon
```

---

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.IO
- **File Uploads**: Cloudinary
- **Authentication**: JWT

---

## ✅ Recent Updates

### Group Chat Implementation (Latest)
- ✅ **Complete Group Chat Support** - Create and participate in group conversations
- ✅ **Enhanced UI** - Tabbed interface for Chats vs Users
- ✅ **Group Message Features** - Group avatars, member count, sender names
- ✅ **Real-time Group Messaging** - All participants receive messages instantly
- ✅ **Unseen Message Tracking** - For both individual and group conversations
- ✅ **Improved Backend Architecture** - Support for both conversation-based and direct messaging

### Environment Security Setup
- ✅ **Secure Configuration** - Proper .env file handling with examples
- ✅ **Production Ready** - Environment-specific configurations
- ✅ **Security Best Practices** - Comprehensive setup guide

## Future Enhancements

- Push notifications
- Message deletion/editing
- Group admin features (add/remove members)
- Message search functionality
- File sharing (documents, videos)
- Message encryption
- Voice/video calls

---

## License

This project is licensed under the [MIT License](LICENSE).

---

##Author

**Shivam Kumar Singh**  
Crafted with ❤️ and caffeine 
