require('./server/config/config');

const express      = require('express');
const bodyParser   = require('body-parser');
const _            = require('lodash');

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

app.get('/', (req, res) => {
   res.render('index.amp.hbs');
});

app.get('/auth', (req, res) => {
    res.set('Content-type', 'application/json');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', '*.ampproject.org');
    res.set('AMP-Access-Control-Allow-Source-Origin', 'https://hot-shapers.on-that.website');
    res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
    res.send({"success": "false"});
});

app.get('/login', (req, res) => {
   res.render('login.hbs');
});

app.post('/order', (req, res) => {
    let body = _.pick(req.body, ['phone']);

    let options = mailOpts;
    options.html = `Номер телефона покупателя: ${body.phone}`;

    sendMail(options, (err, res) => {
        if (err) {
            return res.status(400).send({"success": false});
        }

        res.send({"success": true});
    });
});

app.post('/subscribe', (req, res) => {
    let body = _.pick(req.body, ['email', 'returnurl']);
    let user = new User(body);

    user.save().then(() => {
        res.set('Content-type', 'application/json');
        res.set('Access-Control-Allow-Credentials', true);
        res.set('Access-Control-Allow-Origin', '*.ampproject.org');
        res.set('AMP-Access-Control-Allow-Source-Origin', 'https://hot-shapers.on-that.website');
        res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
        res.send({"success": true})
    }, () => {
        res.status(400).send({"success": false});
    });
});

app.get('/data/products', readProducts, (req, res) => {
    res.send(req.products);
});

app.get('/data/adds', readAdds, (req, res) => {
    res.send(req.adds);
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});