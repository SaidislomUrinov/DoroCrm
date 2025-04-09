import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = Router();

router.post('/signIn', adminController.signIn)
router.get('/verifyAccess', adminMiddleware.verifyAccess, adminController.verifyAccess)
router.post('/logOut', adminMiddleware.verifyAccess, adminController.logOut)
// 
router.post('/users/create', adminMiddleware.verifyAccess, adminController.user.create)
router.get('/users/list', adminMiddleware.verifyAccess, adminController.user.list)
// 
export default router;