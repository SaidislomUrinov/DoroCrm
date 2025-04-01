import { client } from "../configs/redis.js";
import Admin from "../models/Admin.js";

const TTL = 3600;
const KEY = 'ADMIN';

export default {
    set: async (admin) => {
        const key = `${KEY}:${admin?._id}`;
        const data = JSON.stringify(admin);
        await client.setEx(key, TTL, data);
    },
    get: async (adminId) => {
        try {

            const key = `${KEY}:${adminId}`;
            const data = await client.get(key);
            if (!data) {
                const admin = await Admin.findOne({ _id: adminId });
                return admin
            }
            return JSON.parse(data);
        } catch {
            return null;
        }
    },
    clear: async (adminId) => {
        const key = `${KEY}:${adminId}`;
        await client.del(key);

        return true;
    }
}