import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["ROLE_ADMIN"]), getAllUsers);
router.get("/:id", authMiddleware, roleMiddleware(["ROLE_ADMIN"]), getUserById);
router.post("/", authMiddleware, roleMiddleware(["ROLE_ADMIN"]), createUser);
router.put("/:id", authMiddleware, roleMiddleware(["ROLE_ADMIN"]), updateUser);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ROLE_ADMIN"]),
  deleteUser
);

export default router;
