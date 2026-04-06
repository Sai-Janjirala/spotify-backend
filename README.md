# 🎵 Spotify Backend Clone

A scalable backend system inspired by Spotify, built to handle user authentication, playlist management, and music streaming APIs. This project focuses on designing robust REST APIs and managing media data efficiently.

---

## 🚀 Features

* 🔐 User Authentication (JWT-based)
* 🎶 Create, update, and delete playlists
* 📂 Manage songs and media data
* 👤 User profile management
* 🔎 Search functionality for songs/playlists
* ⚡ RESTful API architecture

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Tokens)
* **API Testing:** Postman

---

## 📦 API Overview

### Auth Routes

* `POST /auth/register` → Register user
* `POST /auth/login` → Login user

---

### Playlist Routes

* `POST /playlists` → Create playlist
* `GET /playlists` → Get all playlists
* `PUT /playlists/:id` → Update playlist
* `DELETE /playlists/:id` → Delete playlist

---

### Song Routes

* `POST /songs` → Add new song
* `GET /songs` → Get all songs
* `GET /songs/:id` → Get song details

---

## 🧠 How It Works

1. Users register and log in using secure JWT authentication
2. Authenticated users can create and manage playlists
3. Songs are stored and linked to playlists
4. APIs handle all operations efficiently using REST principles

---

## 📁 Project Structure

```
├── controllers
├── models
├── routes
├── middleware
├── config
├── server.js
```

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd spotify-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### 4. Run the server

```bash
npm start
```

---

## 🔮 Future Improvements

* 🎧 Audio streaming integration
* ❤️ Like/Save songs feature
* 📊 User listening analytics
* 🔁 Recommendation system

---

## 🤝 Conclusion

This project demonstrates building a scalable backend for a music streaming platform using modern web technologies and clean API design principles.

---

⭐ If you like this project, give it a star!
