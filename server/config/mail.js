const nodemailer = require('nodemailer');
const _          = require('lodash');

let mail = (req, res) => {
    let body = _.pick(req.body, ['phone']);

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.DOMAIN_MAIL,
            pass: process.env.DOMAIN_PASS
        }
    });

    let mailOpts = {
        from: 'Почтовый робот <order@hot-shapers.online>',
        to: process.env.ORDER_MAIL,
        subject: 'Заказ на сайте Hot Shapers',
        text: 'На сайте Hot Shapers был сделан заказ.',
        html: `<h1>Заказ на сайте</h1>
               <p>Номер телефона покупателя:</p>
               <h2>${body.phone}</h2>
               <p>Пожалуйста, перезвоните как можно скорее.</p> 
               <h3>Удачной продажи!</h3>`
    };

    transporter.sendMail(mailOpts, (err, info) => {
        if (err) {
            return res.status(400).send('Почтовый сервер недоступен, повторите попытку позднее.');
        } else {
            return res.send();
        }
    });
};

module.exports = { mail };