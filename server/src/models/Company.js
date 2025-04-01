import { model, Schema } from "mongoose";
import { getNow } from "../utils/time.js";

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
        default: 'active'
    }
});
schema.methods.duration = () => {
    return 0
}
export default model('Company', schema);