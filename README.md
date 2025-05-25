# MentorPathBackend
MentorPath
# 🎓 MentorPathBackend

MentorPathBackend is a backend system built using **Node.js**, **TypeScript**, and **MongoDB**. It handles user authentication, video retrieval, and video watch progress tracking. Ideal for e-learning platforms that require tracking lecture completion and issuing certificates based on watched progress.

---

## 🛠 Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** (with Mongoose)
- **JWT** Authentication

---

## 📦 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Ta-Run/MentorPathBackend.git
cd MentorPathBackend
npm install

# Setup the env
PORT=4000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret

#run the server
npm run dev

📌 API Endpoints (All are POST)
✅ User APIs
POST /api/user/login
"paylaod":{
  "email": "Tsharma121@gmail.com",
  "password": "Tarun@123"
}
POST /api/user/signup
"paylaod":
{
  "name": "Taru",
  "email": "tsharma121@gmail.com",
  "password": "Tarun@123"
}
📺 Video APIs
POST /api/video/getVideo
Returns all available videos.

📊 Progress Tracking APIs
POST /api/progress/addProgressReports
Adds a watched interval for a user on a video.

{
  "userId": "6832358e4e711450505535cd",
  "videoId": "683206a85fbedc7fb015300d",
  "start": 20,
  "end": 27
}
POST /api/video/getVideoProgressReport


{
  "userId": "6832358e4e711450505535cd",
  "videoId": "683206a85fbedc7fb015300d"
}
