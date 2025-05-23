import express from "express";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db.js";
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("Iniciando la app...");

app.use(express.json());
app.use('/api/usuarios', userRoutes);

(async () => {
  try {
    console.log("Intentando conectar a la base de datos...");
    await connectDB();
    console.log("Conexión completada");

    const db = getDB();

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
