import express from "express";
import { login, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { registerUser } from "../controllers/registerUser.js";



const router = express.Router();

router.post("/login", login);
router.post("/register", registerUser);
router.post("/logout", authMiddleware, logout);

// Ruta protegida de ejemplo
router.get(
  "/admin/data",
  authMiddleware,
  roleMiddleware(["ROLE_ADMIN"]),
  (req, res) => {
    res.json({ mensaje: "Solo accesible por administradores" });
  }
);

router.get("/me", authMiddleware, (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  // 🟢 OBLIGAR AL NAVEGADOR Y PROXIES A NO GUARDAR EN CACHÉ ESTA RESPUESTA
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const { id_usuario, nombre, role } = req.session.user;
  res.json({ id: id_usuario, username: nombre, role });
});



export default router;
