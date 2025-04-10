import Plan from "../models/Plan.js";

export default {
    create: async (object) => {
        const { name, price, products, catalogs, staffs, staffsSalary, uniqueBuyer, importFromExcel, exportToExcel, cashier, statistics, ordersViaTelegram, branding, apiIntegration, notifyViaTelegram, notifyViaSms, isPopular } = object;

        if (!name || isNaN(price) || !catalogs || !staffs || !statistics || !cashier) throw new Error("Qatorlarni to'ldiring!");

        const plan = new Plan({
            name,
            price,
            products,
            catalogs,
            staffs,
            staffsSalary,
            uniqueBuyer,
            importFromExcel,
            exportToExcel,
            cashier,
            statistics,
            ordersViaTelegram,
            branding,
            apiIntegration,
            notifyViaTelegram,
            notifyViaSms,
            isPopular
        });

        await plan.save();
        return {
            ...plan.toObject(),
            activeCompanies: 0
        }
    },
    list: async () => {
        const plans = await Plan.find();
        const data = [];
        for (let plan of plans) {
            data.push({
                ...plan.toObject(),
                activeCompanies: await plan.activeCompanies()
            })
        }
    },
    edit: async (object) => {
        const { _id, name, price, products, catalogs, staffs, staffsSalary, uniqueBuyer, importFromExcel, exportToExcel, cashier, statistics, ordersViaTelegram, branding, apiIntegration, notifyViaTelegram, notifyViaSms, isPopular } = object;

        if (!name || isNaN(price) || !catalogs || !staffs || !statistics || !cashier) throw new Error("Qatorlarni to'ldiring!");

        const plan = await Plan.findOneAndUpdate({ _id }, {
            name,
            price,
            products,
            catalogs,
            staffs,
            staffsSalary,
            uniqueBuyer,
            importFromExcel,
            exportToExcel,
            cashier,
            statistics,
            ordersViaTelegram,
            branding,
            apiIntegration,
            notifyViaTelegram,
            notifyViaSms,
            isPopular
        });

        if (!plan) throw new Error("Ta'rif topilmadi!")

        return {
            ...plan.toObject(),
            activeCompanies: await plan.activeCompanies()
        }
    },
}