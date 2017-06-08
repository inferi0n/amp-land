let setHeaders = (req, res, next) => {
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Origin', '*.ampproject.org');
    res.set('AMP-Access-Control-Allow-Source-Origin', 'https://hot-shapers.on-that.website');
    res.set('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');
    next();
};

module.exports = { setHeaders };
