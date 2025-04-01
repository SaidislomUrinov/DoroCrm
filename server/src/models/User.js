import { model, Schema } from "mongoose";
import { getNow } from "../utils/time.js";
import jwt from "jsonwebtoken";

const schema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    image: String,
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    access: String,
    block: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Number,
        default: getNow
    }
});

schema.pre("save", async function (next) {
    if (!this.id) {
        const lastUser = await model("User").findOne().sort({ id: -1 }).select("id");
        this.id = lastUser ? lastUser.id + 1 : 1;
    }
    next();
});

schema.methods.companies = async function (q = 'count') {
    if (q === 'count') return 10;
    return [];
};

schema.methods.staffs = async function (q = 'count') {
    if (q === 'count') return 10;
    return [];
};

schema.methods.products = async function (q = 'count') {
    if (q === 'count') return 10;
    return [];
};

export default model("User", schema);
