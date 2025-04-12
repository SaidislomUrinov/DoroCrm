import { model, Schema } from "mongoose";

const schema = new Schema({
    name: String,
    price: Number,
    yearlyDiscount: Number,
    products: Number,
    catalogs: Number,
    staffs: Number,
    staffsSalary: Boolean,
    regularCustomer: Boolean,
    importFromExcel: Boolean,
    exportToExcel: Boolean,
    cashier: {
        type: String,
        enum: ['simple', 'pro', 'super']
    },
    statistics: {
        type: String,
        enum: ['simple', 'pro', 'super']
    },
    ordersViaTelegram: Number,
    branding: Boolean,
    apiIntegration: Boolean,
    // 
    notifyViaTelegram: Boolean,
    notifyViaSms: Boolean,
    isPopular: Boolean
});
schema.methods.activeCompanies = async function () {
    return 0
}
export default model('Plan', schema);