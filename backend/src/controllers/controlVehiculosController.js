import { getDB } from "../config/db.js";
import PDFDocument from 'pdfkit'

// GET ALL CONTROL VEHICULOS - últimos 2 días ordenados DESC
export const getControl = (req, res) => {
  const db = getDB();
  const { matricula } = req.query;

  let query = `
  SELECT c.*, v.num_aparcamiento 
  FROM control_vehiculos c
  LEFT JOIN vehiculos v ON c.cod_vehiculo = v.cod_vehiculo
  WHERE DATE(c.fecha_entrada) >= DATE('now', '-2 days')
`;

  const params = [];

  if (matricula && matricula.length >= 3) {
    query += ` AND matricula LIKE ?`;
    params.push(matricula + "%");
  }

  query += ` ORDER BY datetime(fecha_entrada)`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};


// CREATE CONTROL VEHICULOS
export const createControl = (req, res) => {
  const db = getDB();

  const { matricula, fecha_entrada, fecha_salida, observaciones } = req.body;
  const id_usuario = req.session.user?.id_usuario;

  if (!id_usuario) {
    return res
      .status(401)
      .json({ error: "Sesión no válida o usuario no autenticado" });
  }

  if (!matricula) {
    return res.status(400).json({ error: "Matrícula es obligatoria" });
  }

  // Buscar matrícula en la base de datos para autocompletar
  db.get(
    `
    SELECT p.empresa, v.num_aparcamiento, v.cod_vehiculo
    FROM vehiculos v 
    JOIN propietarios p ON v.propietario = p.id_propietario 
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
      const query = `INSERT INTO control_vehiculos 
        (matricula, empresa, fecha_entrada, fecha_salida, observaciones, num_aparcamiento, id_usuario, cod_vehiculo) 
        VALUES (?,?,?,?,?,?,?,?)`;

      db.run(
        query,
        [
          matricula,
          empresa,
          fecha_entrada || null,
          fecha_salida || null,
          observaciones || null,
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
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res
          .status(404)
          .json({ error: "Línea de control vehículos no encontrada" });
      }

      // Validar matrícula no vacía ni nula para no borrar ese dato
      if (!matricula || matricula.trim() === "") {
        return res
          .status(400)
          .json({ error: "Matrícula no puede estar vacía" });
      }

      const sql = `UPDATE control_vehiculos SET matricula=?, fecha_entrada=?, fecha_salida=?, observaciones=? WHERE cod_control=?`;

      db.run(
        sql,
        [
          matricula,
          fecha_entrada || null,
          fecha_salida || null,
          observaciones || null,
          id,
        ],
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
    }
  );
};

// DELETE CONTROL
export const deleteControl = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  db.get(
    `SELECT * FROM control_vehiculos WHERE cod_control=?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row)
        return res
          .status(404)
          .json({ error: "Línea de control no encontrada" });

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

// GET Buscar matrícula para autocompletar datos
export const buscarMatricula = (req, res) => {
  const db = getDB();
  const { matricula } = req.query;

  if (!matricula) {
    return res.status(400).json({ error: "Falta parámetro matrícula" });
  }

  db.get(
    `SELECT p.empresa, v.num_aparcamiento, v.cod_vehiculo
     FROM vehiculos v
     JOIN propietarios p ON v.propietario = p.id_propietario
     WHERE v.matricula = ?`,
    [matricula],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Error en consulta", detalles: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "Matrícula no encontrada" });
      }
      res.json(row);
    }
  );
};

// EXPORT TO PDF
export const exportarControlPDF = (req, res) => {
  const db = getDB();

  const query = `
    SELECT * FROM control_vehiculos
    ORDER BY datetime(fecha_entrada)
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener datos para PDF" });
    }

    
    //const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      layout: "landscape",
    });

    // Headers para que el PDF se abra en el navegador
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=control_vehiculos.pdf");

    doc.pipe(res);

    // Título centrado
    doc.fontSize(18).text("Control de Vehículos", { align: "center" });
    doc.moveDown();

    // Columnas (sin num_aparcamiento)
    const tableHeaders = [
      { label: "Matrícula", width: 100 },
      { label: "Empresa", width: 120 },
      { label: "Fecha Entrada", width: 130 },
      { label: "Fecha Salida", width: 130 },
      { label: "Observaciones", width: 250 },
    ];

    let startX = 30;
    let startY = doc.y;
    const baseRowHeight = 20;

    function drawTableHeader(y) {
      doc.rect(startX, y, tableHeaders.reduce((acc, h) => acc + h.width, 0), baseRowHeight).fill("#f0f0f0");

      let x = startX;
      tableHeaders.forEach((header) => {
        doc.fillColor("black").font("Helvetica-Bold").fontSize(10)
          .text(header.label, x + 5, y + 5, {
            width: header.width - 10,
            align: "left",
          });
        x += header.width;
      });

      doc.moveTo(startX, y).lineTo(startX + tableHeaders.reduce((acc, h) => acc + h.width, 0), y).stroke();
      doc.moveTo(startX, y + baseRowHeight).lineTo(startX + tableHeaders.reduce((acc, h) => acc + h.width, 0), y + baseRowHeight).stroke();

      x = startX;
      tableHeaders.forEach((header) => {
        doc.moveTo(x, y).lineTo(x, y + baseRowHeight).stroke();
        x += header.width;
      });
      doc.moveTo(x, y).lineTo(x, y + baseRowHeight).stroke();
    }

    drawTableHeader(startY);

    let y = startY + baseRowHeight;

    rows.forEach((fila, i) => {
      const cellHeights = [
        doc.heightOfString(fila.matricula || "", { width: tableHeaders[0].width - 10 }),
        doc.heightOfString(fila.empresa || "", { width: tableHeaders[1].width - 10 }),
        doc.heightOfString(fila.fecha_entrada || "", { width: tableHeaders[2].width - 10 }),
        doc.heightOfString(fila.fecha_salida || "", { width: tableHeaders[3].width - 10 }),
        doc.heightOfString(fila.observaciones || "", { width: tableHeaders[4].width - 10 }),
      ];

      const maxHeight = Math.max(baseRowHeight, ...cellHeights) + 10;

      if (y + maxHeight > doc.page.height - 50) {
        doc.addPage({ layout: "landscape", margin: 30 });
        y = 30;
        drawTableHeader(y);
        y += baseRowHeight;
      }

      if (i % 2 === 0) {
        doc.rect(startX, y, tableHeaders.reduce((acc, h) => acc + h.width, 0), maxHeight).fill("#f9f9f9");
      }

      let x = startX;
      doc.font("Helvetica").fontSize(9).fillColor("black");

      doc.text(fila.matricula || "", x + 5, y + 5, { width: tableHeaders[0].width - 10 });
      x += tableHeaders[0].width;

      doc.text(fila.empresa || "", x + 5, y + 5, { width: tableHeaders[1].width - 10 });
      x += tableHeaders[1].width;

      doc.text(fila.fecha_entrada || "", x + 5, y + 5, { width: tableHeaders[2].width - 10 });
      x += tableHeaders[2].width;

      doc.text(fila.fecha_salida || "", x + 5, y + 5, { width: tableHeaders[3].width - 10 });
      x += tableHeaders[3].width;

      doc.text(fila.observaciones || "", x + 5, y + 5, { width: tableHeaders[4].width - 10 });

      let cellX = startX;
      for (const h of tableHeaders) {
        doc.moveTo(cellX, y).lineTo(cellX, y + maxHeight).stroke();
        cellX += h.width;
      }
      doc.moveTo(cellX, y).lineTo(cellX, y + maxHeight).stroke();
      doc.moveTo(startX, y + maxHeight).lineTo(startX + tableHeaders.reduce((acc, h) => acc + h.width, 0), y + maxHeight).stroke();

      y += maxHeight;
    });

    doc.end();
  });
};
