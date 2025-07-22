# 💬 TalkDesk – Real-time Chat App

A sleek and modern full-stack chat application with real-time messaging, custom profiles, and unseen message tracking. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js), enhanced by **Socket.IO** for real-time communication, and styled with **Tailwind CSS + ShadCN UI**.

---

## 🚀 Features

- 🔐 **Secure Authentication** – Signup/Login with JWT
- 💬 **Instant Messaging** – Real-time 1:1 chats using Socket.IO
- 🟢 **Online Status** – Live user presence indicator
- 📸 **Media Support** – Upload images via Cloudinary
- 📥 **Unseen Message Tracking** – Never miss a message
- 🧑‍💼 **User Profiles** – Update bio, name & avatar
- 🖼️ **Avatar & Sidebar UI Revamp** – Responsive, themed UI with `Heroicons` and `ShadCN`
- 💡 **Light Mode Enhancements** – Contrast-improved for light backgrounds

---

## 🧠 Tech Stack

| Layer        | Tech                                  |
|--------------|----------------------------------------|
| Frontend     | React, Tailwind CSS, ShadCN UI, Heroicons |
| Backend      | Node.js, Express                      |
| Database     | MongoDB, Mongoose                     |
| Real-time    | Socket.IO                             |
| File Upload  | Cloudinary                            |
| Auth         | JWT (JSON Web Tokens)                 |

---

## 🏗️ Project Structure



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
