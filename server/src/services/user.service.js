import User from "../models/User.js";
import { hashPass } from "../utils/hash.js";
import { formatDate, getNow } from "../utils/time.js";
import { deleteFile, uploadImage } from "../utils/file.js";

export default {
    getAll: async (page) => {
        const limit = 30;
        const skip = page * limit - limit;
        const users = await User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const pages = Math.ceil(await User.countDocuments() / limit) || 1;
        // 
        const data = [];
        for (const user of users) {
            data.push({
                _id: user._id,
                id: user.id,
                name: user.name,
                phone: user.phone,
                image: user.image,
                createdAt: formatDate(user.createdAt, "DD.MM.YYYY"),
                block: user.block,
                products: await user.products('count'),
                staffs: await user.staffs('count'),
                companies: await user.companies('count'),
            });
        }
        return {
            data,
            pages,
        }
    },
    create: async (name, phone, password, image) => {
        const user = new User({ name, password: await hashPass(password), phone });

        if (image) {
            const filePath = await uploadImage(image, 'user', user._id);
            user.image = filePath;
        }

        await user.save();
        return {
            _id: user._id,
            id: user.id,
            name: user.name,
            phone: user.phone,
            image: user.image,
            createdAt: formatDate(user.createdAt, "DD.MM.YYYY"),
            block: false,
            products: 0,
            staffs: 0,
            companies: 0,
        }
    },
    edit: async (_id, name, phone, password, image, removeImage) => {
        const user = await User.findById(_id);
        if (!user) throw new Error("User not found");

        if (name) user.name = name;

        if (phone && (phone !== user?.phone)) user.phone = phone;

        if (password) user.password = await hashPass(password);

        if (image) {
            const filePath = await uploadImage(image, 'user', user._id);
            if (user.image) await deleteFile(user.image);
            user.image = filePath;
        } else if (removeImage) {
            if (user.image) await deleteFile(user.image);
            user.image = null;
        }

        await user.save();
        return {
            _id: user._id,
            id: user.id,
            name: user.name,
            phone: user.phone,
            image: user.image,
            createdAt: formatDate(user.createdAt, "DD.MM.YYYY"),
            block: user.block,
            products: await user.products('count'),
            staffs: await user.staffs('count'),
            companies: await user.companies('count'),
        }
    },
    block: async (_id, block) => {
        const user = await User.findByIdAndUpdate(_id, { block }, { new: true });
        if (!user) throw new Error("User not found");
        return true;
    },
    getById: async (id) => {
        const user = await User.findOne({ id });
        if (!user) throw new Error("User not found");
        return [{
            _id: user._id,
            id: user.id,
            name: user.name,
            phone: user.phone,
            image: user.image,
            createdAt: formatDate(user.createdAt, "DD.MM.YYYY"),
            block: user.block,
            products: await user.products('count'),
            staffs: await user.staffs('count'),
            companies: await user.companies('count'),
        }]
    },
    getByPhone: async (phone) => {
        const user = await User.findOne({ phone });
        if (!user) throw new Error("User not found");
        return [{
            _id: user._id,
            id: user.id,
            name: user.name,
            phone: user.phone,
            image: user.image,
            createdAt: formatDate(user.createdAt, "DD.MM.YYYY"),
            block: user.block,
            products: await user.products('count'),
            staffs: await user.staffs('count'),
            companies: await user.companies('count'),
        }]
    }
}