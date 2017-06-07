require('./server/config/config');

const express      = require('express');
const bodyParser   = require('body-parser');
const _            = require('lodash');

const { readAdds }     = require('./server/middleware/readAdds');
const { readProducts } = require('./server/middleware/readProducts');
const { User }         = require('./server/models/user');

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

app.get('/login', (req, res) => {
   res.render('login.hbs');
});

app.post('/order', (req, res) => {
    console.log(res);
});

app.post('/subscribe', (req, res) => {
    let body = _.pick(req.body, ['email', 'returnurl']);
    let user = new User(body);

    user.save().then(() => {
        res.redirect(body.returnurl);
    }, () => {
        res.status(400).redirect(body.returnurl);
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