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
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ mensaje: "Solo accesible por administradores" });
  }
);

export default router;
