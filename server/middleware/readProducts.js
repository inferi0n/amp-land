let readProducts = (req, res, next) => {
    fs.readFile('./data/products.json', (err, data) => {
        if (err) {
            res.status(404).send();
        }

        req.products = JSON.parse(data);
        next();
    });
};

module.exports = { readProducts };