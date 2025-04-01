import fs from 'fs';
import path from 'path';
import Admin from '../models/Admin.js';
import { ADMIN_NAME, ADMIN_PASS, ADMIN_USER } from './env.js';
import { hashPass } from '../utils/hash.js';

const mainFolder = 'uploads';
const folders = ['users', 'staffs', 'products', 'companies'];

if (!fs.existsSync(mainFolder)) {
    fs.mkdirSync(mainFolder);
}

folders.forEach(folder => {
    const folderPath = path.join(mainFolder, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
});

(async function () {
    const admin = await Admin.findOne({ role: 'owner' });
    if (!admin) {
        new Admin({
            name: ADMIN_NAME,
            password: await hashPass(ADMIN_PASS),
            role: 'owner',
            username: ADMIN_USER
        }).save();
    }
})()