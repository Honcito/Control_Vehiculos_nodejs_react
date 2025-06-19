import express from 'express';
import { exportarControlPDF } from '../controllers/controlVehiculosController.js';

import { getControl, createControl, updateControl, deleteControl, buscarMatricula } from "../controllers/controlVehiculosController.js";

import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), getControl);
router.get("/buscar_matricula",authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), buscarMatricula);
router.post("/", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), createControl);
router.put("/:id", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), updateControl);
router.delete("/:id", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), deleteControl);
router.get(
  "/exportar_pdf",
  authMiddleware,
  roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]),
  exportarControlPDF
);


export default router;
