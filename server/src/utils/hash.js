import bcrypt from 'bcrypt';
const SALT = 10;

const hashPass = async function (password) {
    const salt = await bcrypt.genSalt(SALT);
    return await bcrypt.hash(password, salt);
}

const comparePass = async function (password, hash) {
    return await bcrypt.compare(password, hash);
}

export { hashPass, comparePass };