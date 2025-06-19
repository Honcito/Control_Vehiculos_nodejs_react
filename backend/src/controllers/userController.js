import sqlite3 from "sqlite3";
import { getDB } from "../config/db.js";
import bcrypt from "bcrypt";

// GET ALL USERS
export const getAllUsers = (req, res) => {
  const db = getDB();
  db.all("SELECT * FROM usuarios", [], (err, rows) => {

    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
};

// GET USER BY ID
export const getUserById = (req, res) => {
  const db = getDB();
  const id = req.params.id; // Obtener el id del usuario

  const sql = "SELECT * FROM usuarios WHERE id_usuario=?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ error: "Usuario no encontrado " });
    }
    res.json(row);
  });
};

// CREATE USER
export const createUser = async (req, res) => {
  const db = getDB();
  const { nombre, password, telefono } = req.body;
  const rol = "ROLE_USER";

  if (!nombre || !password) {
    return res
      .status(400)
      .json({ error: "Los campos nombre y contraseña son obligatorios" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO usuarios (nombre, password, rol, telefono) VALUES (?,?,?,?)`;

    db.run(sql, [nombre, hash, rol, telefono], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res
        .status(201)
        .json({ message: "Usuario creado con éxito", id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario " });
  }
};

export const updateUser = async (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const { nombre, password, rol, telefono } = req.body;

  console.log("Datos recibidos:", { id, nombre, password, rol, telefono });

  db.get(
    "SELECT * FROM usuarios WHERE id_usuario = ?",
    [id],
    async (err, row) => {
      if (err) {
        console.error("Error SELECT:", err);
        return res.status(500).json({ error: err.message });
      }
      if (!row) return res.status(404).json({ error: "Usuario no encontrado" });

      try {
        let hashedPassword = row.password;

        if (password && password !== row.password) {
          console.log("Encriptando nueva contraseña...");
          hashedPassword = await bcrypt.hash(password, 10);
        }

        const sql = `UPDATE usuarios SET nombre = ?, password = ?, rol = ?, telefono = ? WHERE id_usuario = ?`;
        db.run(
          sql,
          [nombre, hashedPassword, rol, telefono, id],
          function (err) {
            if (err) {
              console.error("Error UPDATE:", err);
              return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
              return res
                .status(400)
                .json({ message: "No se registraron cambios en el usuario" });
            }

            console.log("Usuario actualizado correctamente");
            res.status(200).json({ message: "Usuario actualizado con éxito" });
          }
        );
      } catch (error) {
        console.error("Error en catch:", error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
      }
    }
  );
};


export const deleteUser = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  // Verificar si el usuario existe
  db.get("SELECT * FROM usuarios WHERE id_usuario = ?", [id], (err, row) => {

    if (err) return res.status(500).json({ error: err.message });

    if (!row) return res.status(404).json({ error: "Usuario no encontrado" });

    // Si existe, se procede a eliminar
    const sql = `DELETE FROM usuarios WHERE id_usuario = ?`;
    db.run(sql, [id], function (err) {

      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: "Datos del usuario eliminados con éxito" });
    });
  });
};
