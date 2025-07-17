# 💬 TalkDesk – Real-time Chat App

A full-stack chat application with real-time messaging, profile customization, and unseen message tracking. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Socket.IO** for real-time communication.

---

## 🚀 Features

- 🔐 User Authentication (Signup/Login)
- 💬 Real-time one-to-one messaging
- 🟢 Online/offline status indicators
- 📸 Image message support via Cloudinary
- 📥 Unseen message tracking
- 🧑‍💼 User profile with name, bio & profile picture update
- ⚡ Socket.IO-powered instant communication

---

## 🏗️ Project Structure

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

## 🌐 Frontend (React)

```bash
cd client
npm install
npm start
```

---

## 🧠 Backend (Node.js + Express)

```bash
cd server
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder and add the following:

```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## ⚙️ Scripts

**Frontend:**

```bash
npm run dev         # Start React development server
```

**Backend:**

```bash
npm run dev         # Start backend with nodemon
```

---

## 🔧 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.IO
- **File Uploads**: Cloudinary
- **Authentication**: JWT

---

## ✨ Future Enhancements

- 🧑‍🤝‍🧑 Group chat support
- 🔔 Push notifications
- 🗑️ Message deletion/editing
- 📱 Responsive mobile-first UI
- 🟢 Active chat list with last message preview

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

**Shivam Kumar Singh**  
Crafted with ❤️ and caffeine ☕  
_“Code like a human, deploy like a machine.”_
