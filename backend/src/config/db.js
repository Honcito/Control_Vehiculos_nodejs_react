import sqlite3 from "sqlite3";
import dotenv from 'dotenv';

dotenv.config();

let db;

export function connectDB() {
  return new Promise((resolve, reject) => {
    const DB_PATH = process.env.SQLITE_PATH;
    console.log("Intentando abrir:", DB_PATH);
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("❌ Error al conectar a SQLite:", err.message);
        reject(err);
      } else {
        // Activar claves foráneas
        db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
          if (pragmaErr) {
            console.error(
              "❌ Error al activar foreign_keys:",
              pragmaErr.message
            );
            reject(pragmaErr);
          } else {
            console.log(
              "✅ Conectado a SQLite en",
              DB_PATH,
              "con foreign_keys activadas"
            );
            resolve(db);
          }
        });
      }
    });
  });
}


export function getDB() {
  if (!db) {
    throw new Error("DB no conectada. Ejecuta connectDB primero.");
  }
  return db;
}
