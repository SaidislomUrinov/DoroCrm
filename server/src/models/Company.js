import { model, Schema } from "mongoose";
import { getNow } from "../utils/time.js";
import Subscription from "./Subscription.js";

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Number,
        default: getNow
    },
    botToken: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    }
});
schema.methods.duration = async function () {
    const subscribtion = await Subscription.findOne({ company: this._id });
    return subscribtion ? subscribtion.duration : 0;
}
schema.methods.paymentStatus = async function () {
    const subscribtion = await Subscription.findOne({ company: this._id });
    return await subscribtion.paymentStatus()
}
export default model('Company', schema);