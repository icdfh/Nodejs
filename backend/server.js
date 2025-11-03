require("dotenv").config(); // исправлено: .config() и точка
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // добавлено — иначе auth не работает
const multer = require("multer");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// === 📁 Настройка uploads ===
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

app.use("/uploads", express.static(uploadDir));

// === 🔐 Middleware авторизации ===
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// === 🧩 Регистрация ===
app.post("/auth/register", async (req, res) => {
  const { name = "", email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_pash) VALUES ($1, $2, $3) RETURNING id, name, email, avatar_url",
      [name, email, hash]
    );
    const user = rows[0];
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ user, token });
  } catch (e) {
    if (e.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

// === 🔑 Вход ===
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const u = rows[0];
  if (!u) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, u.password_pash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const user = {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar_url: u.avatar_url,
  };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
  return res.json({ user, token });
});

// === 👤 Профиль ===
app.get("/profile", auth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, avatar_url FROM users WHERE id = $1",
    [req.user.id]
  );
  return res.json(rows[0]);
});

app.put("/profile", auth, upload.single("avatar"), async (req, res) => {
  const name = req.body?.name ?? "";
  let newAvatar = null;
  if (req.file) newAvatar = `/uploads/${req.file.filename}`;

  const { rows } = await pool.query(
    "UPDATE users SET name = $1, avatar_url = COALESCE($2, avatar_url) WHERE id = $3 RETURNING id, name, email, avatar_url",
    [name, newAvatar, req.user.id]
  );
  return res.json(rows[0]);
});

// === 📝 Посты ===
app.get("/posts", async (req, res) => {
  const q = `
    SELECT p.id, p.title, p.body, p.image_url, p.created_at,
           u.id AS user_id, u.name AS author, u.avatar_url
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.id DESC
  `;
  const { rows } = await pool.query(q);
  return res.json(rows);
});

app.post("/posts", auth, upload.single("image"), async (req, res) => {
  const { title, body = "" } = req.body || {};
  if (!title) return res.status(400).json({ error: "Title required" });

  let imageUrl = "";
  if (req.file) imageUrl = `/uploads/${req.file.filename}`;

  const { rows } = await pool.query(
    "INSERT INTO posts (user_id, title, body, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
    [req.user.id, title, body, imageUrl]
  );
  return res.json(rows[0]);
});

// === 🚀 Запуск сервера ===
app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Backend running on port ${process.env.PORT || 5000}`);
});
