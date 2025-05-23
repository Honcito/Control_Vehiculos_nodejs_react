import sqlite3 from "sqlite3";

let db;

export function connectDB() {
  return new Promise((resolve, reject) => {
    const DB_PATH = "C:/database/control_vehiculos.db";
    console.log("Intentando abrir:", DB_PATH);
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error("❌ Error al conectar a SQLite:", err.message);
        reject(err);
      } else {
        console.log("✅ Conectado a SQLite en", DB_PATH);
        resolve(db);
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
