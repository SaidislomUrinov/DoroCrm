import jwt from "jsonwebtoken";
import { ADMIN_JWT } from "../configs/env.js";
import adminCache from "../cache/admin.cache.js";

const verifyAccess = async (req, res, next) => {
    try {
        const token = req.headers?.['x-auth-token'];

        if (!token || !token.startsWith('Bearer ')) {
            throw new Error("Access denied");
        }

        const access = token.replace('Bearer ', '');
        const decoded = jwt.verify(access, ADMIN_JWT);

        if (!decoded?._id) {
            throw new Error("Invalid token");
        }

        const admin = await adminCache.get(decoded._id);

        if (!admin) {
            throw new Error("Session expired, please login again");
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.send({
            ok: false,
            msg: error.message,
        });
    }
};
const onlyOwner = async (req, res, next) => {
    try {
        if (req.admin.role !== 'owner') throw new Error("Only owners can access this route");

        next();
    } catch (error) {
        return res.send({
            ok: false,
            msg: error.message,
        })
    }
};
export default { verifyAccess, onlyOwner };