import { Router } from "express";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import planRoutes from "./routes/plan.routes.js";

export default Router()
    .use('/admin', adminRoutes)
    .use('/user', userRoutes)
    .use('/plan', planRoutes)