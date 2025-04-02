import { model, Schema } from "mongoose";
import { getNow } from "../utils/time.js";

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['cash', 'click', 'payme'],
        required: true
    },
    url: String,//if !cash
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'active', 'expired'],
        default: 'active'
    },
    createdAt: {
        type: Number,
        default: getNow
    },
    paymentTime: {
        type: Number,
    }
});
export default model('Payment', schema);