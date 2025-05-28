import express from "express";
import cors from 'cors';
import session from "express-session";
import SQLiteStore from "connect-sqlite3";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js"; // ⬅️ Faltaba importar esto
import userRoutes from "./routes/userRoutes.js";
import propietarioRoutes from "./routes/propietarioRoutes.js";
import vehiculoRoutes from "./routes/vehiculoRoutes.js";
import controlVehiculosRoutes from "./routes/controlVehiculosRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 3000;
const SQLiteStoreSession = SQLiteStore(session);

import fs from "fs";
import path from "path";

const sessionsDir = path.join(process.cwd(), "sessions");
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}

console.log("Iniciando la app...");

app.use(express.json());

app.use(
  session({
    store: new SQLiteStoreSession({ db: "sessions.sqlite", dir: "./sessions" }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false, // ⬅️ Corregido (estaba mal escrito)
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);



// 🟢 Rutas de autenticación
app.use("/api/auth", authRoutes);

// 🔐 Rutas protegidas por sesión
app.use("/api/usuarios", authMiddleware, userRoutes);
app.use("/api/propietarios", authMiddleware, propietarioRoutes);
app.use("/api/vehiculos", authMiddleware, vehiculoRoutes);
app.use("/api/control_vehiculos", authMiddleware, controlVehiculosRoutes);

// 🔌 Iniciar servidor y conectar BD
(async () => {
  try {
    console.log("Intentando conectar a la base de datos...");
    await connectDB();
    console.log("Conexión completada");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ No se pudo iniciar la app porque falló la conexión a la BD:",
      error.message
    );
    process.exit(1);
  }
})();
