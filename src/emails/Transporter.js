const nodeMailer = require('nodemailer');
const handlebars = require('nodemailer-express-handlebars');

module.exports = createTransport = () => {
    return nodeMailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, 
        auth: {
            user: process.env.SYSTEM_EMAIL, 
            pass: process.env.SYSTEM_EMAIL_PWD 
        }
    })
};
