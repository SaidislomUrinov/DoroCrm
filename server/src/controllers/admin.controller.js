import Admin from "../models/Admin.js";
import companyService from "../services/company.service.js";
import planService from "../services/plan.service.js";
import userService from "../services/user.service.js";
import { phone as ph } from 'phone';
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
    // users
    users: {
        find: async (req, res) => {
            try {
                const { page, id, phone } = req.query;
                if (phone) {
                    const users = await userService.getByPhone(ph(phone, { country: 'uz' }).phoneNumber);

                    if (!users) throw new Error("User not found");

                    return res.send({
                        ok: true,
                        data: users
                    });
                }
                if (id) {
                    const users = await userService.getById(id);

                    if (!users) throw new Error("User not found");

                    return res.send({
                        ok: true,
                        data: users
                    });
                }
                if (page) {
                    const { pages, data } = await userService.getAll(page);
                    // 
                    return res.send({
                        ok: true,
                        data,
                        pages,
                        page: +page
                    });
                }
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message,
                });
            }
        },
        create: async (req, res) => {
            try {
                const { name, phone, password } = req.body;
                const image = req?.files?.image;
                if (!name || !phone || !password) throw new Error("Fill the required fields");

                const validPhone = ph(phone, 'UZ');
                if (!validPhone.isValid) throw new Error("Invalid phone");

                const user = await userService.create(name, validPhone.phoneNumber, password, image);

                return res.send({
                    ok: true,
                    msg: "User created successfully",
                    data: user
                });
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message,
                });
            }
        },
        edit: async (req, res) => {
            try {
                const { _id, name, phone, password, removeImage } = req.body;
                const image = req?.files?.image;
                if (!_id || !name || !phone) throw new Error("Fill the rows");

                const validPhone = ph(phone, 'UZ');
                if (!validPhone.isValid) throw new Error("Invalid phone");

                const user = await userService.edit(_id, name, validPhone.phoneNumber, password, image, removeImage);

                return res.send({
                    ok: true,
                    msg: "User updated successfully",
                    data: user
                });
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message,
                });
            }
        },
        block: async (req, res) => {
            try {
                const { _id, block } = req.body;
                if (!_id || typeof block !== 'boolean') throw new Error("Fill the required fields");

                const user = await userService.block(_id, block);

                return res.send({
                    ok: true,
                    msg: "User status updated successfully",
                });
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message,
                });
            }
        }
    },
    // 
    plans: {
        create: async (req, res) => {
            try {
                const plan = await planService.create(req.body);
                return res.send({
                    ok: true,
                    msg: "Success",
                    data: plan
                })
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message
                });
            }
        },
        getAll: async (req, res) => {
            try {
                const plans = await planService.getAll();
                return res.send({
                    ok: true,
                    data: plans
                })
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message
                });
            }
        },
        edit: async (req, res) => {
            try {
                const plan = await planService.edit(req.body);
                return res.send({
                    ok: true,
                    data: plan
                })
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message
                });
            }
        },
        delete: async (req, res) => {
            try {
                await planService.delete(req.query);
                return res.send({
                    ok: true,
                    msg: "Deleted"
                });
            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message
                });
            }
        }
    },
    //
    companies: {
        get: async (req, res) => {
            try {
                const { uId, page, name, companyId } = req.query;

                if (companyId) {
                    const data = await companyService.getById(companyId);
                    return res.send({
                        ok: true,
                        data
                    });
                };
                if (uId) {
                    const data = await companyService.getByUserId(uId);
                    return res.send({
                        ok: true,
                        data: data.data,
                        page: 1,
                        pages: 1
                    });
                };

                if (name) {
                    const data = await companyService.getByName(uId);
                    return res.send({
                        ok: true,
                        data: data.data,
                        page: 1,
                        pages: 1
                    });
                };

                if (page) {
                    const data = await companyService.getList(page);
                    return res.send({
                        ok: true,
                        ...data
                    });
                };

            } catch (error) {
                return res.send({
                    ok: false,
                    msg: error.message
                });
            }
        },
        create: async (req, res) => {
            try {
                const body = req.body;
                const image = req?.files?.image
                const data = await companyService.create({ ...body, image });
                return res.send({
                    ok: true,
                    msg: "Success",
                    data
                });
            } catch (error) {
                return res.send({
                    ok: true,
                    msg: error.message
                })
            }
        }
    }
}