const multiparty = require('multiparty');

let parseForm = (req, res, next) => {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields) {
        req.body = fields ;
        next();
    });
};

module.exports = { parseForm };