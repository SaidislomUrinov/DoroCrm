import Plan from "../models/Plan.js";

const validateFields = ({ name, price, staffs, products, unlimitedProducts, annualDiscount, catalogs }) => {
    if (!name || !price || !staffs || (!unlimitedProducts && !products) || !annualDiscount || !catalogs) {
        throw new Error("Fill the required rows!");
    }
    if (isNaN(price)) throw new Error("Invalid price");
};

const formatPlan = (plan) => ({
    ...plan,
    products: plan.products === Infinity ? "unlimited" : plan.products
});

export default {
    create: async (data) => {
        validateFields(data);
        const { unlimitedProducts, ...rest } = data;
        const plan = new Plan({ ...rest, products: unlimitedProducts ? Infinity : rest.products });
        await plan.save();
        return formatPlan(plan.toObject());
    },

    getAll: async () => {
        const plans = await Plan.find({}).lean();
        return plans.map(formatPlan);
    },

    edit: async (data) => {
        validateFields(data);
        const { _id, unlimitedProducts, ...rest } = data;
        const plan = await Plan.findOneAndUpdate({ _id }, { ...rest, products: unlimitedProducts ? Infinity : rest.products }, { new: true });
        if (!plan) throw new Error("Plan not found!");
        return formatPlan(plan.toObject());
    },

    delete: async ({ _id }) => {
        await Plan.deleteOne({ _id });
        return true;
    }
};
