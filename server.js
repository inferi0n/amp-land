require('./server/config/config');

const express      = require('express');
const bodyParser   = require('body-parser');
const _            = require('lodash');
const cookieParser = require('cookie-parser');

const { mongoose }     = require('./server/db/mongoose');
const { readAdds }     = require('./server/middleware/readAdds');
const { readProducts } = require('./server/middleware/readProducts');
const { User }         = require('./server/models/user');
const { mailOpts, sendMail } = require('./server/config/mail');

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');

app.set('views engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', readProducts, (req, res) => {
   res.render('index.amp.hbs', {
       items: req.products.items
   });
});

app.get('/auth', (req, res) => {
    res.set('Content-type', 'application/json');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', '*.ampproject.org');
    res.set('AMP-Access-Control-Allow-Source-Origin', 'https://hot-shapers.on-that.website');
    res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

    if (req.cookies['amp-subscribe']) {
        if (req.cookies['amp-subscribe'].access === true) {
            res.send({
                access: true
            });
        } else {
            res.send({
                access: false
            });
        }
    } else {
        res.send({
            access: false
        });
    }
});

app.get('/login', (req, res) => {
   res.render('login.hbs');
});

app.post('/order', (req, res) => {
    let body = _.pick(req.body, ['phone']);

    let options = mailOpts;
    options.html = `Номер телефона покупателя: ${body.phone}`;

    res.set('Content-type', 'application/json');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', '*.ampproject.org');
    res.set('AMP-Access-Control-Allow-Source-Origin', 'https://hot-shapers.on-that.website');
    res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

    console.log('1');

    sendMail(options, (err, info) => {
        if (err) {
            return res.status(400).send(info.response);
        }

        return res.send(info.response);
    });
});

app.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'returnurl']);
    let user = new User(body);

    res.set('Content-type', 'application/json');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', '*.ampproject.org');
    res.set('AMP-Access-Control-Allow-Source-Origin', 'https://hot-shapers.on-that.website');
    res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

    user.save().then(() => {
        let access = {
            "access":     true,
            "subscriber": true
        };
        res.cookie('amp-subscribe', access);
        res.redirect(body.returnurl + '#success=true');
    }, (err) => {
        res.clearCookie('amp-subscribe');
        console.log(err);
        res.send({
            error: "Адрес электронной почты уже занят. Попробуйте снова"
        })
    });
});

app.get('/data/products', readProducts, (req, res) => {
    res.send(req.products);
});

app.get('/data/adds', readAdds, (req, res) => {
    res.send(req.adds);
});

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
        console.log(`Server is up on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});

