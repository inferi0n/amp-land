const nodemailer = require('nodemailer');
const _          = require('lodash');

let mail = (req, res) => {
    res.set('Content-type', 'application/json');

    let name = req.body.name[0];
    let phone = req.body.phone[0];

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.DOMAIN_MAIL,
            pass: process.env.DOMAIN_PASS
        }
    });

    let htmlClient;
    if (name) {
        htmlClient = `<p>Имя покупателя</p><p><b>${name}</b></p>`;
        res.cookie('amp-username', name);
    } else {
        htmlClient = `<p>Покупатель не представился</p>`;
    }

    let html = `<h1>Заказ на сайте</h1>
               ${htmlClient}
               <p>Номер телефона покупателя:</p>
               <p><b>${phone}</b></p>
               <p>Пожалуйста, перезвоните как можно скорее.</p> 
               <h3>Удачной продажи!</h3>`


    let mailOpts = {
        from: 'Почтовый робот <order@hot-shapers.online>',
        to: process.env.ORDER_MAIL,
        subject: 'Заказ на сайте Hot Shapers',
        text: 'На сайте Hot Shapers был сделан заказ.',
        html: html
    };

    transporter.sendMail(mailOpts, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(400).send({name: name, phone});
        } else {
            return res.send({name: name, phone: phone});
        }
    });
};

module.exports = { mail };