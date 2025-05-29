import express from "express";
import { login, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";



const router = express.Router();

router.post("/login", login);
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

  const { id_usuario, nombre, role } = req.session.user;
  res.json({ id: id_usuario, username: nombre, role }); // o usa los nombres que prefieras
});



export default router;
