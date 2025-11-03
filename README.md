📱 React Native Social Network — Node.js + PostgreSQL Backend
🚀 Overview

This project is a full-stack social network app consisting of:

Backend: Node.js + Express + PostgreSQL

Frontend: React Native (Expo) mobile app

It supports user authentication, profile editing, creating posts with images, and JWT-based authorization.
All data is stored in a PostgreSQL database, and uploaded images are served from the backend /uploads directory.

🧩 Folder Structure
project-root/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── uploads/
│   ├── package.json
│   └── .env
└── frontend/
    ├── App.js
    ├── app.json
    ├── package.json
    ├── src/
    │   ├── api.js
    │   ├── AuthContext.js
    │   ├── components/
    │   │   └── PostCard.js
    │   ├── screens/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Posts.js
    │   │   ├── Profile.js
    │   │   └── CreatePost.js
    │   └── navigation/AppTabs.js
    └── assets/
⚙️ Backend Setup (Node.js + PostgreSQL)
📦 Requirements

Node.js v18+

npm or yarn

PostgreSQL 14+

pgAdmin (optional)

🔧 Installation
1. Clone the repo:
git clone https://github.com/<your-org>/<your-repo>.git
cd project-root/backend
2. Install dependencies:
npm install
3. Create PostgreSQL database

Open pgAdmin or terminal:

CREATE DATABASE social_network;

Then create tables:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
4. Create .env file in backend/
PORT=5000
JWT_SECRET=super_secret_key
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=social_network
5. Start the server
node server.js

✅ You should see:

✅ Backend running on port 5000
📱 Frontend Setup (React Native with Expo)
📦 Requirements

Node.js v18+

Expo CLI (npm install -g expo-cli)

Android Emulator or Expo Go app on a real device

🔧 Installation
1. Go to the frontend folder:
cd ../frontend
2. Install dependencies:
npm install
3. Set the API URL in src/api.js
For Android Emulator:
export const API_URL = "http://10.0.2.2:5000";
For Real Device (same Wi-Fi):

Find your local IPv4:

ipconfig

and set:

export const API_URL = "http://192.168.x.x:5000";
🔑 Expo Commands
Start the app:
npx expo start

Press:

a — to launch Android emulator

w — to open in web preview

or scan QR code with Expo Go (mobile)

🧠 Available Screens
Screen	Description
Login	User login with email + password
Register	Create account
Posts	Feed of all posts
CreatePost	Add post with title, text, and image
Profile	View and edit name or avatar
🛠 API Endpoints
Method	Route	Description
POST	/auth/register	Register new user
POST	/auth/login	Login and receive token
GET	/profile	Get user profile (JWT required)
PUT	/profile	Update name or avatar
GET	/posts	Get all posts
POST	/posts	Create new post (JWT + image)
📦 Backend Dependencies
"dependencies": {
  "bcrypt": "^5.1.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.0",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5",
  "pg": "^8.11.3"
}
📦 Frontend Dependencies
"dependencies": {
  "@react-navigation/native": "^6.1.7",
  "@react-navigation/native-stack": "^6.9.13",
  "@react-navigation/bottom-tabs": "^6.6.4",
  "expo": "^51.0.0",
  "expo-image-picker": "~15.0.7",
  "expo-status-bar": "~1.11.1",
  "react": "18.3.1",
  "react-native": "0.74.3",
  "react-native-safe-area-context": "^4.8.2",
  "react-native-screens": "^3.29.0",
  "@expo/vector-icons": "^14.0.0"
}
🧾 Quick Start (for teammates)
🖥 Backend:
git clone <repo-url>
cd backend
npm install
create DB and .env
node server.js
📱 Frontend:
cd frontend
npm install
npx expo start

Then open:

http://10.0.2.2:5000

or your local IP in the mobile app.

🧠 Notes

uploads/ folder is auto-created on backend start.

JWT token stored in AsyncStorage for persistent login.

Avatar and post images are accessible via backend static URLs.

Compatible with Windows, macOS, Linux.

Fully works on Android Emulator, Expo Go, and physical devices.

🏁 Done!

After these steps, any teammate can simply:

git clone
npm install
npx expo start

and immediately get a working social network app connected to a live Node.js + PostgreSQL backend.
