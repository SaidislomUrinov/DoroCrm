import { model, Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import { ADMIN_JWT } from "../configs/env.js";
import { comparePass } from "../utils/hash.js";
import adminCache from "../cache/admin.cache.js";

const schema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'owner'],
        default: 'admin',
    },
    access: String,
});

schema.methods.checkPassword = async function (password) {
    return await comparePass(password, this.password);
};

schema.methods.signIn = async function () {
    try {
        const access = jwt.sign({ _id: this._id }, ADMIN_JWT, { expiresIn: '1d' });
        this.access = access;

        await this.save();

        await adminCache.set(this);

        return access;
    } catch (error) {
        console.log(error);
        return;
    }
};

schema.methods.signOut = async function () {
    try {
        this.access = null;
        await this.save();

        await adminCache.clear(this._id);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export default model('Admin', schema);