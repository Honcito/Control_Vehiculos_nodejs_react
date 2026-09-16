import { getDB } from "../config/db.js";
import bcrypt  from 'bcrypt';



export const login = (req, res) => {
    const db = getDB();
    const { nombre, password } = req.body;

    db.get(`SELECT * FROM usuarios WHERE nombre=?`, [nombre], async (err, user) => {
        if(err) return res.status(500).json({ error: err.message });
        if(!user) return res.status(400).json({ error: "Usuario no encontrado" });

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(401).json({ error: "Contraseña incorrecta" });

        // 🟢 REGENERAR LA SESIÓN PARA EVITAR MANTENER EL ID ANTERIOR
        req.session.regenerate((err) => {
            if (err) return res.status(500).json({ error: "Error al iniciar sesión" });

            req.session.user = { id_usuario: user.id_usuario, nombre: user.nombre, role: user.rol };
            
            // Asegurar que la respuesta tampoco se guarde en caché
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.status(200).json({ message: "Login correcto", user: req.session.user });
        });
    });
}

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
    // Borra la cookie 'connect.sid' con el mismo path que usaste en express-session
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "Sesión cerrada" });
  });
};


// export const getCurrentUser = (req, res) => {
//   if(!req.user) {
//     return res.status(401).json({ message: "No autenticado" });
//   }

//   const { id, nombre, rol } = req.user;
//   res.json({ id, nombre, role });
// }
