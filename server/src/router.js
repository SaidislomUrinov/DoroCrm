import { Router } from "express";
import adminRoutes from "./routes/admin.routes.js";

export default Router()
    .use('/admin', adminRoutes)