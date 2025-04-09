import { phone as ph } from "phone";
import User from "../models/User.js";
import { hashPass } from "../utils/hash.js";
import { uploadImage } from "../utils/file.js";
import { formatDate } from "../utils/time.js";

export default {
    create: async (object) => {
        const { name, image, phone, password } = object;

        if (!name || !password || !phone) throw new Error("Qatorlarni to'ldiring!");

        const checkPhone = ph(phone, { country: 'uz' });
        if (!checkPhone.isValid) throw new Error("Raqamin to'g'ri kiriting!");

        if (!/^[A-z_.0-9]{5,}$/.test(password)) throw new Error("Parolda kamida 5 ta ishora bo'lsin!");

        const user = new User({
            name,
            phone: checkPhone.phoneNumber,
            password: await hashPass(password)
        });

        if (image) {
            const filePath = await uploadImage(image, 'user', user._id);
            user.image = filePath
        }

        await user.save();

        return {
            id: user.id,
            _id: user._id,
            name: user.name,
            phone: user.phone,
            image: user.image,
            companies: 0,
            staffs: 0,
            products: 0,
            created: formatDate(user.created)
        }
    },
    list: async (page) => {
        if (!page) throw new Error("Sahifa kiritilmadi!");

        const limit = 30;
        const skip = page * limit - limit;
        const total = await User.countDocuments();
        const pages = Math.ceil(total / limit) || 1;

        const data = [];
        const users = await User.find().sort({ created: -1 }).skip(skip).limit(limit);
        for (let user of users) {
            data.push({
                id: user.id,
                _id: user._id,
                name: user.name,
                phone: user.phone,
                image: user.image,
                companies: 0,
                staffs: 0,
                products: 0,
                created: formatDate(user.created)
            })
        };

        return {
            pages,
            page,
            data,
            total
        }
    }
}