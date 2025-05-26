
import { getDB } from '../config/db.js'


// GET ALL CONTROL VEHICULOS
export const getControl = (req, res) => {
    const db = getDB();
    db.all(`SELECT * FROM control_vehiculos`, [], (err, rows) => {

        if(err) return res.status(500).json({ error: err.message });

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
    const { matricula, empresa, fecha_entrada, fecha_salida, observaciones, num_plaza } = req.body;

    // Buscar matrícula en la base de datos
    db.get(
      `
        SELECT p.empresa, v.num_aparcamiento 
        FROM vehiculos v 
        JOIN propietarios p ON v.id_propietario = p.id_propietario 
        WHERE v.matricula = ?
    `,
      [matricula],
      (err, row) => {
        if (err) {
          return res
            .status(500)
            .json({
              error: "Error al consultar la matrícula",
              detalles: err.message,
            });
        }

        if (!row) {
          return res.status(400).json({ error: "Matrícula no encontrada" });
        }

        const empresa = row.empresa; // Autocompletado
        const num_plaza = row.num_aparcamiento;

        // Insertar en la tabla de controles
        const query = `INSERT INTO control_vehiculos (matricula, empresa, fecha_entrada, fecha_salida, observaciones, num_plaza) VALUES (?,?,?,?,?,?)`;

        db.run(
          query,
          [
            matricula,
            empresa,
            fecha_entrada,
            fecha_salida,
            observaciones,
            num_plaza,
          ],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json({
                  error: "Error al crear la fila de control",
                  detalles: err.message,
                });
            }

            res
              .status(201)
              .json({
                message: "Control creado correctamente",
                controlId: this.lastID,
              });
          }
        );
      }
    );
};
