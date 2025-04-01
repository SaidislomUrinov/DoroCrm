const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm';
const PORT = process.env.PORT || 5000;
const ADMIN_JWT = process.env.ADMIN_JWT || 'abw451ds';
const USER_JWT = process.env.USER_JWT || 'asjdfnausidjdw8';
const ADMIN_USER = process.env.ADMIN_USER || 'saidweb';
const ADMIN_PASS = process.env.ADMIN_PASS || '555555';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Saidislom';
export {
    MONGO_URI,
    PORT,
    ADMIN_JWT,
    USER_JWT,
    ADMIN_USER,
    ADMIN_PASS,
    ADMIN_NAME,
}