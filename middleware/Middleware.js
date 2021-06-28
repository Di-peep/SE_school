const jwt = require('jsonwebtoken');
const {tokenKey} = require('../config.js');


module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    // перевірка наявності токену в заголовку авторизації
    try {
        let token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).send('Користувач не авторизований');
        }

        // декодування
        let decodedData = jwt.verify(token, tokenKey);
        req.user = decodedData;
        next();

    } catch (e) {
        //console.log(e);
        return res.status(403).send('Помилка авторизування');
    }
}
