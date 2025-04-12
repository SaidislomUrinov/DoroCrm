import Plan from "../models/Plan.js";

export default {
    create: async (object) => {
        const { name, price, products, catalogs, staffs, staffsSalary, regularCustomer, importFromExcel, exportToExcel, cashier, yearlyDiscount, statistics, ordersViaTelegram, branding, apiIntegration, notifyViaTelegram, notifyViaSms, isPopular, unlimitProducts, unlimitOrdersViaTelegram } = object;

        if (!name || isNaN(price) || !catalogs || !staffs || !statistics || !cashier) throw new Error("Qatorlarni to'ldiring!");

        if (!unlimitProducts && (isNaN(products) || 1 > products)) throw new Error("Mahsulotlar soni kiritilmadi!");

        if (!unlimitOrdersViaTelegram && (isNaN(ordersViaTelegram) || 1 > ordersViaTelegram)) throw new Error("Mahsulotlar soni kiritilmadi!");

        const plan = new Plan({
            name,
            price,
            products: unlimitProducts ? Infinity : products,
            catalogs,
            staffs,
            staffsSalary,
            regularCustomer,
            yearlyDiscount: yearlyDiscount || 0,
            importFromExcel,
            exportToExcel,
            cashier,
            statistics,
            ordersViaTelegram: unlimitOrdersViaTelegram ? Infinity : ordersViaTelegram,
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
        const { _id, name, price, products, yearlyDiscount, catalogs, staffs, staffsSalary, regularCustomer, importFromExcel, exportToExcel, cashier, statistics, ordersViaTelegram, branding, apiIntegration, notifyViaTelegram, notifyViaSms, isPopular, unlimitProducts, unlimitOrdersViaTelegram } = object;

        if (!name || isNaN(price) || !catalogs || !staffs || !statistics || !cashier) throw new Error("Qatorlarni to'ldiring!");

        if (!unlimitProducts && (isNaN(products) || 1 > products)) throw new Error("Mahsulotlar soni kiritilmadi!");

        if (!unlimitOrdersViaTelegram && (isNaN(ordersViaTelegram) || 1 > ordersViaTelegram)) throw new Error("Mahsulotlar soni kiritilmadi!");

        const plan = await Plan.findOneAndUpdate({ _id }, {
            name,
            price,
            products: unlimitProducts ? Infinity : products,
            catalogs,
            staffs,
            staffsSalary,
            regularCustomer,
            importFromExcel,
            exportToExcel,
            cashier,
            yearlyDiscount: yearlyDiscount || 0,
            statistics,
            ordersViaTelegram: unlimitOrdersViaTelegram ? Infinity : ordersViaTelegram,
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