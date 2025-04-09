import { model, Schema } from "mongoose";
import { getNow } from "../utils/time.js";
import jwt from 'jsonwebtoken';
const schema = new Schema({
    id: Number,
    name: String,
    phone: {
        type: String,
        unique: true
    },
    password: String,
    access: String,
    image: String,
    created: {
        type: Number,
        default: getNow
    }
});
// 
schema.pre('save', async function (next) {
    if (this.isNew) {
        const User = model('User');
        const count = await User.countDocuments();
        this.id = count + 1;
    }
    next();
});

schema.methods.companies = async function (type = 'count') {
    if (type === 'count') {
        return 0
    } if (type === 'list') {
        return []
    }
};
schema.methods.staffs = async function (type = 'count') {
    if (type === 'count') {
        return 0
    } if (type === 'list') {
        return []
    }
};
schema.methods.products = async function (type = 'count') {
    if (type === 'count') {
        return 0
    } if (type === 'list') {
        return []
    }
}
export default model('User', schema)