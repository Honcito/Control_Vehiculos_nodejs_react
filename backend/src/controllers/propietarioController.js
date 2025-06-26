import sqlite3 from "sqlite3";
import { getDB } from "../config/db.js";

// GET ALL OWNERS
export const getAllOwners = (req, res) => {
  const db = getDB();
  db.all("SELECT * FROM propietarios", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// GET OWNER BY ID
export const getOwnerById = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  db.get(
    "SELECT * FROM propietarios WHERE id_propietario = ?",
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res.status(404).json({ error: "Propietario no encontrado" });
      res.json(row);
    }
  );
};

// CREATE OWNER
export const createOwner = (req, res) => {
  const db = getDB();
  const { nombre, empresa, telefono, num_plazas } = req.body;

  if (!nombre)
    return res.status(400).json({ error: "El campo nombre es obligatorio" });

  const sql = `
    INSERT INTO propietarios (nombre, empresa, telefono, num_plazas)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [nombre, empresa, telefono, num_plazas], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ message: "Propietario creado con éxito", id: this.lastID });
  });
};

// UPDATE OWNER
export const updateOwner = (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const { nombre, empresa, telefono, num_plazas } = req.body;

  db.get(
    "SELECT * FROM propietarios WHERE id_propietario = ?",
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res.status(404).json({ error: "Propietario no encontrado" });

      const sql = `
      UPDATE propietarios
      SET nombre = ?, empresa = ?, telefono = ?, num_plazas = ?
      WHERE id_propietario = ?
    `;
      db.run(sql, [nombre, empresa, telefono, num_plazas, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        if (this.changes === 0) {
          return res.status(400).json({ message: "No se realizaron cambios" });
        }

        res.status(200).json({ message: "Propietario actualizado con éxito" });
      });
    }
  );
};

// DELETE OWNER
export const deleteOwner = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  console.log("ID recibido para eliminar:", id); // 👈 Esto es lo que quiero que pruebes

  db.get(
    "SELECT * FROM propietarios WHERE id_propietario = ?",
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res.status(404).json({ error: "Propietario no encontrado" });

      db.run(
        "DELETE FROM propietarios WHERE id_propietario = ?",
        [id],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          console.log("Filas eliminadas:", this.changes); // 👈 Esto también

          if (this.changes === 0)
            return res
              .status(404)
              .json({ error: "No se eliminó ningún registro" });

          res.status(200).json({ message: "Propietario eliminado con éxito" });
        }
      );
    }
  );
};

