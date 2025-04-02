import { model, Schema } from "mongoose";
import { getNow } from "../utils/time.js";
import Payment from "./Payment.js";

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    createdAt: {
        type: Number,
        default: getNow
    },
    start: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    }
});
schema.methods.paymentStatus = async function () {
    const payment = await Payment.findOne({ subscription: this._id }).sort({ createdAt: -1 });
    if (!payment) return null;
    return payment.status;
};
schema.methods.paymentInformation = async function () {
    const payment = await Payment.findOne({ subscription: this._id }).sort({ createdAt: -1 });
    return payment;
};
schema.methods.paymentList = async function () {
    const payments = await Payment.find({ subscription: this._id }).sort({ createdAt: -1 });
    return payments;
}
export default model('Subscription', schema);