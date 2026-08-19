import express from "express";
import cors from "cors";
import session from "express-session";
import SQLiteStore from "connect-sqlite3";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import "./tasks/backupTask.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import propietarioRoutes from "./routes/propietarioRoutes.js";
import vehiculoRoutes from "./routes/vehiculoRoutes.js";
import controlVehiculosRoutes from "./routes/controlVehiculosRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

// __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🟢 Configuración de Proxy (Necesario si usas cPanel / Nginx / Apache tras HTTPS)
app.set("trust proxy", 1);

// 🟢 Lista de orígenes permitidos en CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://parking-vehiculos.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (p. ej. herramientas o Server-to-Server) o incluidas en la lista
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por la política CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  // console.log("CORS Headers:", req.headers.origin);
  next();
});

const PORT = process.env.PORT || 3000;
const SQLiteStoreSession = SQLiteStore(session);

const sessionsDir = path.join(process.cwd(), "sessions");
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}

console.log("Iniciando la app...");

// Servir los archivos estáticos del build de React (si aplicara localmente)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 🟢 Configuración de Cookies de Sesión para Cross-Site (Netlify <-> Servidor Backend)
app.use(
  session({
    store: new SQLiteStoreSession({ db: "sessions.sqlite", dir: "./sessions" }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,      // Obligatorio para enviar cookies mediante HTTPS entre dominios
      sameSite: "none",  // Permitir compartir cookie entre dominios diferentes (Netlify y backend)
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

// Redirigir todo lo que no sea API al index.html
app.get(/^\/(?!api).*/, (req, res) => {
  console.log("Serving index.html for:", req.originalUrl);
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

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