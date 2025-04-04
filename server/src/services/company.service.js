import Company from "../models/Company.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import { uploadImage } from "../utils/file.js";
import { calculateMonths, getNow } from "../utils/time.js";

const paymentTypes = ['cash', 'click', 'payme'];

export default {
    create: async ({ userId, name, image, planId, isPaid, paymentType, botToken, month }) => {
        // 
        if (!userId || !name || !planId || typeof isPaid !== 'boolean') {
            throw new Error("Fill the rows");
        }

        if (isPaid) {
            if (!paymentTypes.includes(paymentType)) {
                throw new Error("invalidPaymentType");
            }
            if (!month || isNaN(month) || month <= 0) {
                throw new Error("Fill the rows");
            }
        }

        const company = new Company({
            name,
            user: userId,
            botToken: botToken || undefined
        });

        if (image) {
            company.image = await uploadImage(image, 'company', company._id);
        }

        const subscription = new Subscription({
            user: userId,
            company: company._id,
            plan: planId,
            status: isPaid ? 'active' : undefined,
            start: isPaid ? getNow() : undefined,
            duration: isPaid ? calculateMonths(month) : undefined
        });

        let payment;
        if (isPaid) {
            company.status = 'active';
            payment = new Payment({
                user: userId,
                type: paymentType,
                subscription: subscription._id,
                status: 'paid',
                paymentTime: getNow()
            });
        }

        await Promise.all([
            company.save(),
            subscription.save(),
            isPaid ? payment.save() : null
        ]);

        return {
            _id: company._id,
            name: company.name,
            image: company.image,
            status: company.status
        };
    },
    getList: async (page) => {
        const limit = 30;
        const skip = page * limit - limit;
        const total = await Company.countDocuments();
        const pages = Math.ceil(total / limit) || 1;
        // 
        const companies = await Company.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('name image status');
        return {
            page,
            pages,
            data: companies
        }
    },
    getByUserId: async (uId) => {
        const companies = await Company.find({ user: uId }).sort({ createdAt: -1 }).select('name image status');
        return {
            data: companies
        }
    },
    getByName: async (name) => {
        const companies = await Company.find({
            name: { $regex: name, $options: 'i' }
        }).sort({ createdAt: -1 }).select('name image status');
        return {
            data: companies
        }
    },
    getById: async (companyId) => {
        const company = await Company.findById(companyId);
        if (!company) throw new Error("Company not found");

        return {

        };
    }
};
