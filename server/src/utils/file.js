import fs from "fs";
import path from "path";
import sharp from "sharp";

/** 
 * @param {import('express-fileupload').UploadedFile} file Image file
 * @param {'user' | 'product' | 'staff' | 'company'} type Type
 * @param {string} oId Object Id
 * @returns {Promise<string | null>} filePath
 */
export async function uploadImage(file, type, oId) {
    if (!file) return null;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) return null;

    // Ko‘plik shaklga o‘tkazish
    const pluralTypes = {
        user: "users",
        product: "products",
        staff: "staffs",
        company: "companies",
    };
    const folder = pluralTypes[type] || type;

    const uploadDir = `uploads/${folder}`;
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = `${uploadDir}/${oId}.webp`;

    await sharp(file.data).resize(300, 300).toFormat("webp").toFile(filePath);

    return `/${filePath}`;
}

export async function deleteFile(filePath) {
    try {
        if (fs.existsSync(`.${filePath}`)) {
            fs.unlinkSync(`.${filePath}`);
        }
    } catch (error) {
        console.error("Faylni o‘chirishda xatolik:", error.message);
    }
}
