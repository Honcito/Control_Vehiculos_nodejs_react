import sqlite3 from "sqlite3";
import { getDB } from "../config/db.js";

// GET ALL VEHICLES
export const getAllVehicles = (req, res) => {
  const db = getDB();
  db.all(`SELECT * FROM vehiculos`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
};

// GET VEHICLE BY ID
export const getVehicleById = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  const sql = `SELECT * FROM vehiculos WHERE cod_vehiculo=?`;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      return res.status(400).json({ error: "Vehículo no encontrado" });
    }

    res.json(row);
  });
};

// CREATE A VEHICLE
export const createVehicle = (req, res) => {
  const db = getDB();
  const {
    matricula,
    num_aparcamiento,
    observaciones,
    id_propietario,
    telefono_propietario,
  } = req.body;

  if (!matricula || !num_aparcamiento) {
    return res.status(400).json({
      error:
        "Los campos de matrícula y número de aparcamiento son obligatorios",
    });
  }

  try {
    const sql = `INSERT INTO vehiculos (matricula, num_aparcamiento, observaciones, id_propietario, telefono_propietario) VALUES (?,?,?,?,?)`;

    db.run(
      sql,
      [
        matricula,
        num_aparcamiento,
        observaciones,
        id_propietario,
        telefono_propietario,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res
          .status(201)
          .json({ message: "Vehiculo creado con éxito", id: this.lastID });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error al crear el vehículo" });
  }
};

// UPDATE A VEHICLE
export const updateVehicle = async (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const {
    matricula,
    num_aparcamiento,
    observaciones,
    id_propietario,
    telefono_propietario,
  } = req.body;

  // Verificar si el usuario existe
  db.get(
    `SELECT * FROM vehiculos WHERE cod_vehiculo=?`,
    [id],
    async (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!row)
        return res.status(404).json({ error: "Vehículo no encontrado" });

      try {
        const sql = `UPDATE vehiculos SET matricula=?, num_aparcamiento=?, observaciones=?, id_propietario=?, telefono_propietario=? WHERE cod_vehiculo=?`;

        db.run(
          sql,
          [
            matricula,
            num_aparcamiento,
            observaciones,
            id_propietario,
            telefono_propietario,
            id,
          ],
          function (err) {
            if (err) {
              return res.status(400).json({ error: err.message });
            }

            if (this.changes === 0) {
              return res
                .status(400)
                .json({ message: "No se registraron cambios en el vehículo" });
            }

            res.status(200).json({ message: "Vehículo actualizado con éxito" });
          }
        );
      } catch (error) {
        res.status(400).json({ error: "Error al actualizar el vehículo" });
      }
    }
  );
};

// DELETE VEHICLE
export const deleteVehicle = (req, res) => {};
