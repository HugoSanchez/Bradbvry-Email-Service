const crypto = require('crypto');

const key = process.env.AES_KEY;
const iv = process.env.AES_IV;

const encrypt = (string) => {
    console.log('here: ', string)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(string);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decrypt(string) {
    let iv = Buffer.from(process.env.AES_IV.toString('hex'), 'hex');
    let encryptedText = Buffer.from(string, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {encrypt, decrypt}