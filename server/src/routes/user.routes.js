import { Router } from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import userController from "../controllers/user.controller.js";

const router = Router();
// crud
router.post('/create', adminMiddleware.verifyAccess, userController.create)
router.get('/list', adminMiddleware.verifyAccess, userController.list)
router.get('/search', adminMiddleware.verifyAccess, userController.search)
router.put('/edit', adminMiddleware.verifyAccess, userController.edit)
// 
export default router;