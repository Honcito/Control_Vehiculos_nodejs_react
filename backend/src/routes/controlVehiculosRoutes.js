import express from 'express';

import { getControl, createControl } from "../controllers/controlVehiculosController.js";

import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), getControl);
router.post("/", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), createControl);
// router.put("/", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), updateControl);
// router.delete("/", authMiddleware, roleMiddleware(["ROLE_ADMIN", "ROLE_USER"]), deleteControl);


export default router;
