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

        req.session.user = { id: user.id, nombre: user.nombre, rol: user.rol};
        res.status(200).json({ message: "Login correcto", user: req.session.user });
    });

   
}

export const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.json({ message: "Sesión cerrada" });
};
