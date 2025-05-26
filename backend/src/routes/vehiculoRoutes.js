import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import{
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} from '../controllers/vehiculoController.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['ROLE_ADMIN']),getAllVehicles);
router.get('/:id', authMiddleware, roleMiddleware(['ROLE_ADMIN']),getVehicleById);
router.post('/', authMiddleware, roleMiddleware(['ROLE_ADMIN']),createVehicle);
router.put('/:id', authMiddleware, roleMiddleware(['ROLE_ADMIN']),updateVehicle);
router.delete('/:id', authMiddleware, roleMiddleware(['ROLE_ADMIN']),deleteVehicle);

export default router;