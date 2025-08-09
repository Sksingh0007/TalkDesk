# Environment Variables Setup Guide

This guide explains how to properly set up environment variables for the TalkDesk chat application while keeping sensitive data secure.

## 🔐 Why Environment Variables?

Environment variables keep sensitive information like API keys, database URLs, and secrets out of your source code. This prevents:
- Accidental exposure of credentials when sharing code
- Security vulnerabilities from hardcoded secrets
- Different configuration for development, staging, and production

## 📁 File Structure

```
project-root/
├── server/
│   ├── .env                 # Your actual server environment variables (DO NOT COMMIT)
│   └── .env.example         # Template showing required variables (SAFE TO COMMIT)
├── client/
│   ├── .env                 # Your actual client environment variables (DO NOT COMMIT)
│   └── .env.example         # Template showing required variables (SAFE TO COMMIT)
└── ENVIRONMENT_SETUP.md     # This guide
```

## 🛠️ Setup Instructions

### 1. Server Environment Variables

1. **Copy the example file:**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Edit the `.env` file with your actual values:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Fill in your actual values:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talkdesk
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### 2. Client Environment Variables

1. **Copy the example file:**
   ```bash
   cd client
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   ```bash
   nano .env
   ```

3. **Fill in your backend URL:**
   ```env
   # For development
   VITE_BACKEND_URL=http://localhost:5000
   
   # For production (replace with your deployed backend URL)
   # VITE_BACKEND_URL=https://your-backend-domain.com
   ```

## 🔑 Getting Your Credentials

### MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get your connection string from "Connect" → "Connect your application"
5. Replace `<username>`, `<password>`, and `<dbname>` with your values

### JWT Secret
Generate a secure random string (minimum 32 characters):
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator (use a reputable one)
# Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### Cloudinary
1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your credentials from the Dashboard
4. Copy Cloud Name, API Key, and API Secret

## ✅ Verification

### Test Server Environment
```bash
cd server
npm run server
```
You should see:
- "MongoDB connected successfully"
- "Server is running on port 5000"

### Test Client Environment
```bash
cd client
npm run dev
```
The app should connect to your backend without CORS errors.

## 🚫 Security Best Practices

### DO NOT:
- ❌ Commit `.env` files to Git
- ❌ Share your `.env` files in chat/email
- ❌ Use weak JWT secrets (< 32 characters)
- ❌ Use the same credentials for all environments

### DO:
- ✅ Use different credentials for development/production
- ✅ Rotate your secrets regularly
- ✅ Use strong, unique passwords
- ✅ Keep `.env.example` files updated
- ✅ Use environment-specific values

## 🔄 Git Configuration

Your `.gitignore` files should already include `.env`:

**server/.gitignore:**
```
node_modules
.env
```

**client/.gitignore:**
```
node_modules
.env
dist
```

## 🚀 Deployment

### For Production:
1. **Never use `.env` files in production**
2. **Set environment variables through your hosting platform:**
   - **Vercel:** Project Settings → Environment Variables
   - **Netlify:** Site Settings → Environment Variables
   - **Heroku:** Config Vars
   - **Railway:** Variables tab

### Environment-Specific Values:
```env
# Development
MONGODB_URI=mongodb://localhost:27017/talkdesk-dev
VITE_BACKEND_URL=http://localhost:5000

# Production
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/talkdesk-prod
VITE_BACKEND_URL=https://your-api.vercel.app
```

## 🆘 Troubleshooting

### Common Issues:

1. **"MongoDB connection failed"**
   - Check your MONGODB_URI
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username/password are correct

2. **"CORS errors"**
   - Check VITE_BACKEND_URL matches your server URL
   - Ensure server is running on the specified port

3. **"JWT errors"**
   - Ensure JWT_SECRET is at least 32 characters
   - Make sure client and server use the same secret

4. **"Cloudinary upload fails"**
   - Verify all three Cloudinary credentials
   - Check if your account is active

### Getting Help:
- Check server logs: `npm run server` in server directory
- Check client console: F12 → Console tab in browser
- Verify environment variables are loaded: `console.log(process.env.VITE_BACKEND_URL)` in client

## 📝 Example Production Deployment

1. **Deploy Backend (Vercel):**
   ```bash
   cd server
   vercel --prod
   # Set environment variables in Vercel dashboard
   ```

2. **Deploy Frontend (Netlify):**
   ```bash
   cd client
   npm run build
   # Upload dist/ folder or connect Git repository
   # Set VITE_BACKEND_URL to your Vercel URL
   ```

Remember: Always test your production deployment with environment variables before going live!