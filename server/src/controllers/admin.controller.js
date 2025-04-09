import Admin from "../models/Admin.js";
import userService from "../services/user.service.js";

export default {
    signIn: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) throw new Error("Fill the rows");

            const admin = await Admin.findOne({ username: username?.toLowerCase()?.trim() });

            if (!admin) throw new Error("Invalid credentials");

            if (!await admin.checkPassword(password)) throw new Error("Invalid credentials");

            const access = await admin.signIn();

            return res.send({
                ok: true,
                msg: "Login successful",
                data: {
                    _id: admin?._id,
                    name: admin.name,
                    role: admin.role,
                    username: admin.username
                },
                access,
            })
        } catch (error) {
            console.error(error.message);
            return res.send({
                ok: false,
                msg: error.message,
            });
        }
    },
    verifyAccess: async (req, res) => {
        try {
            if (!req.admin) throw new Error("Access denied");

            return res.send({
                ok: true,
                msg: "Access granted",
                data: {
                    _id: req.admin._id,
                    name: req.admin.name,
                    role: req.admin.role,
                    username: req.admin.username
                },
            });
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message,
            });
        }
    },
    logOut: async (req, res) => {
        try {
            if (!req.admin) throw new Error("Access denied");
            await req.admin.signOut();
            return res.send({
                ok: true,
                msg: "Logout successful",
            });
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message,
            });
        }
    },
    user: {
        create: async (req, res) => {
            try {
                const user = await userService.create({ ...req.body, image: req?.files?.image });
                return res.send({
                    ok: true,
                    msg: "Bajarildi",
                    data: user
                })
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message
                })
            }
        },
        list: async (req, res) => {
            try {
                const { page } = req.query;
                const list = await userService.list(page);
                return res.send({
                    ok: true,
                    ...list
                })
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message
                })
            }
        }
    }
}