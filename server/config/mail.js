const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'inferion00@gmail.com',
        pass: 'leo903110psw'
    }
});

let mailOpts = {
    from: 'Почтовый робот <order@hot-shapers.online>',
    to: 'mephisto011@gmail.com',
    subject: 'Заказ на сайте Hot Shapers',
    text: 'На сайте Hot Shapers был сделан заказ.',
    html: '<b>Номер телефона клиента:</b>'
};

let sendMail = transporter.sendMail;

module.exports = { mailOpts, sendMail };