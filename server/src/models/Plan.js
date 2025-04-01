import { model, Schema } from "mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true
    },//Tarif nomi
    price: {
        type: Number,
        required: true
    },//Tarif narxi
    products: {
        type: Number,
        required: true
    },//Mahsulotlar soni
    staffs: {
        type: Number,
        required: true
    },//Ishchilar soni
    annualDiscount: {
        type: Number,
        required: true
    },//Yillik chegirma %
    catalogs: {
        type: Number,
        required: true
    },//Cataloglar soni
    isPopular: {
        type: Boolean,
        required: true
    },//Popularmi
    // 
    regularCustomer: {
        type: Boolean,
        required: true
    },//Doimiy mijoz
    cashbackSystem: {
        type: Boolean,
        required: true
    },//Mijoz uchun cashback tizimi
    additionalRow: {
        type: Boolean,
        required: true
    }, //Qo'shimcha qator (Kommentariya)
    // integration
    telegramBot: {
        type: Boolean,
        required: true
    },//Bot orqali kunlik atchot yuborish
    paymentSystems: {
        type: Boolean,
        required: true
    },//To'lov tizimlarini ulash
    apiSystems: {
        type: Boolean,
        required: true
    },//Buyurtmalarni qabul qilish va mahsulot hamda kataloglarni olish uchun api
});

export default model('Plan', schema);