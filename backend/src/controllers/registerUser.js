import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";

// Abre la base de datos (ajusta la ruta si es necesario)
const db = new sqlite3.Database(
  process.env.SQLITE_PATH || "C:/database/control_vehiculos_react.db"
);

export const registerUser = (req, res) => {
  const { nombre, password, telefono } = req.body;

  if (!nombre || !password) {
    return res
      .status(400)
      .json({ message: "Nombre y contraseña son obligatorios" });
  }

  // 1. Verificar si el usuario ya existe
  const checkUserSql = `SELECT * FROM usuarios WHERE nombre = ?`;

  db.get(checkUserSql, [nombre], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error en la base de datos" });
    }

    if (row) {
      // Usuario ya existe
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // 2. Hashear la contraseña
    bcrypt.genSalt(10, (errSalt, salt) => {
      if (errSalt) {
        console.error(errSalt);
        return res.status(500).json({ message: "Error al generar la salt" });
      }

      bcrypt.hash(password, salt, (errHash, hashedPassword) => {
        if (errHash) {
          console.error(errHash);
          return res
            .status(500)
            .json({ message: "Error al hashear la contraseña" });
        }

        // 3. Insertar el nuevo usuario (agregamos también el campo telefono)
        const insertSql = `INSERT INTO usuarios (nombre, password, telefono, rol) VALUES (?, ?, ?, ?)`;

        db.run(
          insertSql,
          [nombre, hashedPassword, telefono || null, "ROLE_USER"],
          function (errRun) {
            if (errRun) {
              console.error(errRun);
              return res
                .status(500)
                .json({ message: "Error al crear el usuario" });
            }

            // Usuario creado con éxito
            return res
              .status(201)
              .json({ message: "Usuario creado correctamente" });
          }
        );
      });
    });
  });
};
