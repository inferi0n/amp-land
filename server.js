require('./server/config/config');

const express      = require('express');
const bodyParser   = require('body-parser');
const _            = require('lodash');
const cookieParser = require('cookie-parser');

const { mongoose }     = require('./server/db/mongoose');
const { readAdds }     = require('./server/middleware/readAdds');
const { readProducts } = require('./server/middleware/readProducts');
const { setHeaders } = require('./server/middleware/setHeaders');
const { User }         = require('./server/models/user');
const { mail } = require('./server/config/mail');

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');

app.set('views engine', 'hbs');
app.use(express.static(__dirname + '/public', {
    etag: true,
    maxAge: '1d'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', readProducts, (req, res) => {
   res.render('index.amp.min.hbs', {
       items: req.products.items
   });
});

app.get('/auth', setHeaders, (req, res) => {
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

app.post('/order', mail);

app.post('/login', setHeaders, (req, res) => {
    let body = _.pick(req.body, ['email', 'returnurl']);
    let user = new User(body);

    user.save().then(() => {
        let access = {
            "access":     true,
            "subscriber": true
        };
        res.cookie('amp-subscribe', access);
        res.redirect(body.returnurl + '#success=true');
    }, (err) => {
        res.clearCookie('amp-subscribe');
        res.send("Адрес электронной почты уже занят. Попробуйте снова")
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

