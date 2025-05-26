import express from 'express';
import {authMiddleware} from "../middleware/authMiddleware.js";
import {roleMiddleware} from '../middleware/roleMiddleware.js';
import { getAllOwners, getOwnerById, createOwner, updateOwner, deleteOwner  } from '../controllers/propietarioController.js';

  



const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["ROLE_ADMIN"]), getAllOwners);
router.get('/:id', authMiddleware, roleMiddleware(['ROLE_ADMIN']),getOwnerById);
router.post('/', authMiddleware, roleMiddleware(['ROLE_ADMIN']),createOwner);
router.put('/:id', authMiddleware, roleMiddleware(['ROLE_ADMIN']),updateOwner);
router.delete('/:id', authMiddleware, roleMiddleware(['ROLE_ADMIN']),deleteOwner);

export default router;