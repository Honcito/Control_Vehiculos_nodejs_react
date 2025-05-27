import { getDB } from "../config/db.js";

// GET ALL CONTROL VEHICULOS
export const getControl = (req, res) => {
  const db = getDB();
  db.all(`SELECT * FROM control_vehiculos`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows);
  });
};

// CREATE CONTROL VEHICULOS
export const createControl = (req, res) => {
  const db = getDB();
  // if (!req.body || Object.keys(req.body).length === 0) {
  //   return res
  //     .status(400)
  //     .json({ error: "El cuerpo de la solicitud está vacío o malformado." });
  // }
  const {
    matricula,
    empresa,
    fecha_entrada,
    fecha_salida,
    observaciones,
    num_aparcamiento,
  } = req.body;
  const id_usuario = req.session.user?.id_usuario;

  if (!id_usuario) {
    return res
      .status(401)
      .json({ error: "Sesión no válida o usuario no autenticado " });
  }

  // Buscar matrícula en la base de datos
  db.get(
    `
        SELECT p.empresa, v.num_aparcamiento, v.cod_vehiculo
        FROM vehiculos v 
        JOIN propietarios p ON v.id_propietario = p.id_propietario 
        WHERE v.matricula = ?
    `,
    [matricula],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          error: "Error al consultar la matrícula",
          detalles: err.message,
        });
      }

      if (!row) {
        return res.status(400).json({ error: "Matrícula no encontrada" });
      }

      const empresa = row.empresa; // Autocompletado
      const num_aparcamiento = row.num_aparcamiento;
      const cod_vehiculo = row.cod_vehiculo;

      // Insertar en la tabla de controles
      const query = `INSERT INTO control_vehiculos (matricula, empresa, fecha_entrada, fecha_salida, observaciones, num_aparcamiento, id_usuario, cod_vehiculo) VALUES (?,?,?,?,?,?,?,?)`;

      db.run(
        query,
        [
          matricula,
          empresa,
          fecha_entrada,
          fecha_salida,
          observaciones,
          num_aparcamiento,
          id_usuario,
          cod_vehiculo,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({
              error: "Error al crear la fila de control",
              detalles: err.message,
            });
          }

          res.status(201).json({
            message: "Control creado correctamente",
            controlId: this.lastID,
          });
        }
      );
    }
  );
};

// UPDATE CONTROL
export const updateControl = (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const { matricula, fecha_entrada, fecha_salida, observaciones } = req.body;

  db.get(
    `SELECT * FROM control_vehiculos WHERE cod_control=?`,
    [id],
    async (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res
          .status(404)
          .json({ error: "Línea de control vehículos no encontrada " });
      }

      try {
        const sql = `UPDATE control_vehiculos SET matricula=?, fecha_entrada=?, fecha_salida=?, 
      observaciones=? WHERE cod_control=?`;

        db.run(
          sql,
          [matricula, fecha_entrada, fecha_salida, observaciones, id],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
              return res.status(400).json({
                message: "No se registraron cambios en esta línea de control",
              });
            }
            res
              .status(200)
              .json({ message: "Línea de control actualizada con éxito" });
          }
        );
      } catch (error) {
        res
          .status(400)
          .json({ error: "Error al actualizar la línea de control" });
      }
    }
  );
};

// DELETE CONTROL
export const deleteControl = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  // Verificar si la línea de control existe
  db.get(
    `SELECT * FROM control_vehiculos WHERE cod_control=?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res
          .status(400)
          .json({ error: "Línea de control no encontrada" });

      // Si existe se procede a eliminar
      const sql = `DELETE FROM control_vehiculos WHERE cod_control=?`;
      db.run(sql, [id], function (err) {
        if (err) {
          return res.status(500).json({ err: err.message });
        }

        res
          .status(200)
          .json({ message: "Línea de control eliminada con éxito" });
      });
    }
  );
};
