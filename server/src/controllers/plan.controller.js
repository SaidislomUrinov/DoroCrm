import planService from "../services/plan.service.js"

export default {
    create: async (req, res) => {
        try {
            const data = await planService.create(req.body);
            return res.send({
                ok: true,
                data,
                msg: "Saqlandi!"
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
            const data = await planService.edit(req.body);
            return res.send({
                ok: true,
                data,
                msg: "Saqlandi!"
            });
        } catch (error) {
            return res.send({
                ok: false,
                msg: error.message
            })
        }
    },
    list: async (_, res) => {
        try {
            const data = await planService.list();
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
    }
}