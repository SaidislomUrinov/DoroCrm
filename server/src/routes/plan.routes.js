import { Router } from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import planController from "../controllers/plan.controller.js";

const router = Router();
// crud
router.post('/create', adminMiddleware.verifyAccess, planController.create)
router.get('/list', adminMiddleware.verifyAccess, planController.list)
router.put('/edit', adminMiddleware.verifyAccess, planController.edit)
// 
export default router;