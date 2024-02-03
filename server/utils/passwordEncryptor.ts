import * as bcrypt from 'bcrypt'

export async function encryptPassword (password) {
    const salt = await bcrypt.genSalt();
    const passwordEncrypted = await bcrypt.hash(password, salt);
    return passwordEncrypted;
}

export async function comparePassword(password, passwordEncrypted) {
    const isMatch = await bcrypt.compare(password, passwordEncrypted);
    return isMatch;
}
