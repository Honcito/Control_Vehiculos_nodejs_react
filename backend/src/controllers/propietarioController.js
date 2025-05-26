import sqlite3 from "sqlite3";
import { getDB } from "../config/db.js";

const db = new sqlite3.Database(
  process.env.SQLITE_PATH || "C:/database/control_vehiculos.db"
);

// GET ALL OWNERS
export const getAllOwners = (req, res) => {
  const db = getDB();
  db.all(`SELECT * FROM propietarios`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// GET OWNER BY ID
export const getOwnerById = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  const sql = `SELECT * FROM propietarios WHERE id_propietario=?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(400).json({ error: "Propietario no encontrado" });
    }

    res.json(row);
  });
};

// CREATE OWNER
export const createOwner = (req, res) => {
  const db = getDB();
  const { nombre, empresa, telefono, num_plazas } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El campo nombre es obligatorio" });
  }

  try {
    const sql = `INSERT INTO propietarios (nombre, empresa, telefono, num_plazas) VALUES (?,?,?,?)`;

    db.run(
      sql,
      [nombre, empresa, telefono, num_plazas],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Aquí accedemos a this.lastID y lo mostramos
        res
          .status(201)
          .json({ message: "Propietario creado con éxito", id: this.lastID });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error al crear el propietario" });
  }
};

// UPDATE OWNER
export const updateOwner = async (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const { nombre, empresa, telefono, num_plazas } = req.body;

  db.get(
    `SELECT * FROM propietarios WHERE id_propietario=?`,
    [id],
    async (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!row)
        return res.status(404).json({ error: "Propietario no encontrado" });

      try {
        const sql = `UPDATE propietarios SET nombre=?, empresa=?, telefono=?, num_plazas=? WHERE id_propietario=?`;
        db.run(
          sql,
          [nombre, empresa, telefono, num_plazas, id],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
              return res.status(400).json({
                message: "No se registraron cambios en el propietario" });
            }

            res
              .status(200)
              .json({ message: "Propietario actualizado con éxito" });
          }
        );
      } catch (error) {
        res.status(400).json({ error: "Error al actualizar el propietario" });
      }
    }
  );
};

// DELETE OWNER
export const deleteOwner = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  // Verificar si el propietario existe
  db.get(
    `SELECT * FROM propietarios WHERE id_propietario=?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!row) return res.status(400).json({ error: "Usuario no encontrado" });

      // Si existe, se procede a eliminar
      const sql = `DELETE FROM propietarios WHERE id_propietario=?`;
      db.run(sql, [id], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res
          .status(200)
          .json({ message: "Datos del propietario eliminados con éxito" });
      });
    }
  );
};
