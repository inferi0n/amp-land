require('./server/config/config');

const express      = require('express');
const bodyParser   = require('body-parser');
const _            = require('lodash');
const cookieParser = require('cookie-parser');

const { mongoose }     = require('./server/db/mongoose');
const { readAdds }     = require('./server/middleware/readAdds');
const { readProducts } = require('./server/middleware/readProducts');
const { parseForm }  = require('./server/middleware/multiparty');
const { setHeaders } = require('./server/middleware/setHeaders');
const { User }         = require('./server/models/user');
const { mail } = require('./server/config/mail');

const app = express();
const port = process.env.PORT;

app.disable('x-powered-by');

app.set('views engine', 'hbs');
app.use(express.static(__dirname + '/public', {
    etag: true,
    maxAge: '30 days'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', setHeaders, readProducts, (req, res) => {
   res.render('index.amp.min.hbs', {
       items: req.products.items,
       adds: req.products.adds,
       url: process.env.SITE_URL
   });
});

app.get('/auth', setHeaders, (req, res) => {
    res.set('Content-type', 'application/json');
    let access = {};

    if (req.cookies['amp-subscribe']) {
        if (req.cookies['amp-subscribe'].subscriber === true) {
            if (req.cookies['amp-username']) {
                access.name = req.cookies['amp-username'];
            }
            access.subscriber = true;
            access.access = true;
        } else if (req.cookies['amp-subscribe'].access === true) {
            access.subscriber = false;
            access.access = true;
        } else {
            access.subscriber = false;
            access.access = false;
        }
    } else {
        access.subscriber = false;
        access.access = false;
    }

    res.send(access);
});

app.get('/login', (req, res) => {
   res.render('login.hbs', {
       url: process.env.SITE_URL
   });
});

app.post('/order', parseForm, setHeaders, mail);

app.post('/login', setHeaders, (req, res) => {
    let body = _.pick(req.body, ['name', 'email', 'returnurl']);
    let user = new User(body);
    let access = {
        "access":     true,
        "subscriber": true
    };

    user.save().then(() => {
        res.cookie('amp-username', body.name);
        res.cookie('amp-subscribe', access);
        return res.redirect(body.returnurl + '#success=true');
    }, (err) => {
        if (err.code && err.code === 11000) {
            res.cookie('amp-username', body.name);
            res.cookie('amp-subscribe', access);
            return res.redirect(body.returnurl + '#success=true');
        } else {
            return res.send("<h2>Приносим свои извинения</h2><p>Произошла ошибка, пожалуйста попробуйте позднее, или перезвоните по бесплатному номеру</p><p><a href='+74951202762' title='Бесплатный звонок'>+7 (495) 120-27-62</a></p> <p>Cообщите об ошибке и приобретайте наши товары со <b>скидкой 15%</b>.</p>")
        }
    });
});

app.get('/data/products', readProducts, (req, res) => {
    res.set('Content-type', 'application/json');
    res.send(req.products);
});

app.get('/data/adds', readAdds, (req, res) => {
    res.set('Content-type', 'application/json');
    res.send(req.adds);
});

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
        console.log(`Server is up on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});

