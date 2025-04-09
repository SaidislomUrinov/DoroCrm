import userService from "../services/user.service.js";

export default {
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
            const page = Number(req.query.page || 1);
            if (isNaN(page) || page < 1) throw new Error("Sahifa noto'g'ri!");

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
    },
    search: async (req, res) => {
        try {
            const { search } = req.query;
            const data = await userService.search(search);
            return res.send({
                ok: true,
                data
            });
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            })
        }
    },
    edit: async (req, res) => {
        try {
            const data = await userService.edit({ ...req.body, image: req?.files?.image });
            return res.send({
                ok: true,
                data,
                msg: "Yangilandi!"
            })
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            })
        }
    }
}