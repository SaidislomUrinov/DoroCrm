import { phone as ph } from "phone";
import User from "../models/User.js";
import { hashPass } from "../utils/hash.js";
import { deleteFile, uploadImage } from "../utils/file.js";
import { formatDate } from "../utils/time.js";

export default {
    create: async (object) => {
        const { name, image, phone, password } = object;

        if (!name || !password || !phone) throw new Error("Qatorlarni to'ldiring!");

        const checkPhone = ph(phone, { country: 'uz' });
        if (!checkPhone.isValid) throw new Error("Raqamin to'g'ri kiriting!");

        if (!/^[A-z_.0-9]{5,}$/.test(password)) throw new Error("Parolda kamida 5 ta ishora bo'lsin!");

        const checkUser = await User.findOne({ phone: checkPhone.phoneNumber });
        if (checkUser) throw new Error("Ushbu raqam avval ishlatilgan!");

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
    },
    search: async (search) => {
        if (!search) throw new Error("Sahifa kiritilmadi!");

        const data = [];
        const users = await User.find({ phone: { $regex: search, $options: "i" } }).sort({ created: -1 });
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

        return data
    },
    edit: async (object) => {
        const { name, _id, password, image, phone } = object;
        if (!name || !_id || !phone) throw new Error("Majburiy qatorlarni to'ldiring!");

        const checkPhone = ph(phone, { country: 'uz' });
        if (!checkPhone.isValid) throw new Error("Raqamin to'g'ri kiriting!");

        const user = await User.findById(_id);
        if (!user) throw new Error("User topilmadi!");

        const phoneExists = await User.findOne({ phone: checkPhone.phoneNumber });

        if (phoneExists && phoneExists._id.toString() !== _id.toString()) {
            throw new Error("Bu raqam boshqa foydalanuvchiga tegishli!");
        }

        if (user.phone !== checkPhone.phoneNumber) {
            user.phone = checkPhone.phoneNumber;
        }

        if (image && user.image) {
            await deleteFile(user.image);
            const filePath = await uploadImage(image, 'user', _id);
            user.image = filePath;
        }

        if (password) {
            if (!/^[A-z_.0-9]{5,}$/.test(password)) throw new Error("Parolda kamida 5 ta ishora bo'lsin!");
            user.password = await hashPass(password);
        }

        user.name = name;
        await user.save();

        return {
            _id,
            name,
            phone: user.phone,
            image: user.image
        }
    }
}