import express from "express";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import propietarioRoutes from './routes/propietarioRoutes.js';
import vehiculoRoutes from './routes/vehiculoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("Iniciando la app...");

app.use(express.json());
app.use('/api/usuarios', userRoutes);
app.use('/api/propietarios', propietarioRoutes);
app.use('/api/vehiculos', vehiculoRoutes);

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
