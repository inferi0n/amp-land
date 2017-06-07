let readAdds = (req, res, next) => {
    fs.readFile('./data/adds.json', (err, data) => {
        if (err) {
            res.status(404).send();
        }

        req.adds = JSON.parse(data);
        next();
    });
};

module.exports = { readAdds };