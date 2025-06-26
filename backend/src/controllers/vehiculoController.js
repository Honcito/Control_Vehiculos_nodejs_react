import sqlite3 from "sqlite3";
import { getDB } from "../config/db.js";

// GET ALL VEHICLES
export const getAllVehicles = (req, res) => {
  const db = getDB();
  const sql = `
  SELECT v.cod_vehiculo, v.matricula, v.num_aparcamiento, v.observaciones,
         p.id_propietario as propietario_id,
         p.nombre as propietario_nombre,
         p.telefono as propietario_telefono,
         p.empresa as propietario_empresa
  FROM vehiculos v
  LEFT JOIN propietarios p ON v.id_propietario = p.id_propietario
`;


  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Aquí transformamos para que en cada vehículo haya un objeto propietario
    const data = rows.map((row) => ({
      cod_vehiculo: row.cod_vehiculo,
      matricula: row.matricula,
      num_aparcamiento: row.num_aparcamiento,
      observaciones: row.observaciones,
      propietario: {
        id_propietario: row.propietario_id,
        nombre: row.propietario_nombre,
        telefono: row.propietario_telefono,
        empresa: row.propietario_empresa, // <-- aquí
      },
    }));
    
    res.json(data);
  });
};


// GET VEHICLE BY ID
export const getVehicleById = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  db.get(
    `SELECT v.*, p.empresa, p.nombre as nombre_propietario, p.telefono as telefono_propietario
     FROM vehiculos v
     LEFT JOIN propietarios p ON v.id_propietario = p.id_propietario
     WHERE v.cod_vehiculo = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Vehículo no encontrado" });
      res.json(row);
    }
  ); 
}

// CREATE VEHICLE
export const createVehicle = (req, res) => {
  const db = getDB();
  const { matricula, num_aparcamiento, observaciones, id_propietario } = req.body;

  if (!matricula || !num_aparcamiento) {
    return res.status(400).json({ error: "Los campos matrícula y aparcamiento son obligatorios" });
  }

  const sql = `
    INSERT INTO vehiculos (matricula, num_aparcamiento, observaciones, propietario)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [matricula, num_aparcamiento, observaciones, id_propietario], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Vehículo creado con éxito", id: this.lastID });
  });
};

// UPDATE VEHICLE
export const updateVehicle = (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const { matricula, num_aparcamiento, observaciones, id_propietario } = req.body;

  db.get("SELECT * FROM vehiculos WHERE cod_vehiculo = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Vehículo no encontrado" });

    const sql = `
      UPDATE vehiculos
      SET matricula = ?, num_aparcamiento = ?, observaciones = ?, propietario = ?
      WHERE cod_vehiculo = ?
    `;

    db.run(sql, [matricula, num_aparcamiento, observaciones, id_propietario, id], function (err) {
      if (err) return res.status(400).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(400).json({ message: "No se realizaron cambios en el vehículo" });
      }

      res.status(200).json({ message: "Vehículo actualizado con éxito" });
    });
  });
};


// DELETE VEHICLE
export const deleteVehicle = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  db.get("SELECT * FROM vehiculos WHERE cod_vehiculo = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Vehículo no encontrado" });

    db.run(
      "DELETE FROM vehiculos WHERE cod_vehiculo = ?",
      [id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Vehículo eliminado con éxito" });
      }
    );
  });
};
