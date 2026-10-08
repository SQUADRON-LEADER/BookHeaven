const express = require('express'); 
const app = express(); 
const cors = require('cors'); 
const mongoose = require("mongoose");
require('dotenv').config();

const users = require("./routes/user.js"); 
const books = require("./routes/books.js");
const admin = require("./routes/admin.js");
const librarian = require("./routes/librarian.js");
const home = require("./routes/home.js");

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://library-management-app-karan.vercel.app",
];

app.use(express.json()); // Parse JSON
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev mode
    }
  },
  credentials: true,
}));

app.use("/users", users);
app.use("/books", books);
app.use("/admin", admin);
app.use("/librarian", librarian);
app.use("/home", home);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AGC Central Library API is running..." });
});

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library_management";

async function startServer() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Database Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Warning / Error:", err.message);
    console.log("Tip: Ensure MongoDB is running locally or set a valid MONGO_URI in backend/.env");
  }

  app.listen(PORT, () => {
    console.log(`AGC Library API Server running on port ${PORT}`);
  });
}

startServer();