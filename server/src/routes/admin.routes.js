import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = Router();

router.post('/signIn', adminController.signIn)
router.get('/verifyAccess', adminMiddleware.verifyAccess, adminController.verifyAccess)
router.post('/logOut', adminMiddleware.verifyAccess, adminController.logOut)
// 
router.route('/users')
    .all(adminMiddleware.verifyAccess)
    .get(adminController.users.find)
    .post(adminController.users.create)
    .put(adminController.users.edit)
router.post('/users/block', adminController.users.block)
// plans
router.route('/plans')
    .all(adminMiddleware.verifyAccess)
    .get(adminController.plans.getAll)
    .post(adminController.plans.create)
    .put(adminController.plans.edit)
    .delete(adminController.plans.delete)

router.route('/companies')
    .all(adminMiddleware.verifyAccess)
    .get(adminController.companies.get)
    .post(adminController.companies.create)

export default router;