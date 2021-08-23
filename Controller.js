const fs = require('fs');
const jwt = require('jsonwebtoken');
const {tokenKey} = require('./config.js');
const db = require('./db/db.js');
const btcSaveNewRate = require('./btc/btc.js');


class Controller {

    async test(req, res) {
        res.send('Сервер працює');
    }

    async create(req, res) {

        let user_login = req.body.username;
        let user_password = req.body.password;

        if (!db.findUser(user_login)) {
            db.createUser(user_login, user_password);
            res.status(201).send('Зареєстровано нового користувача');
        } else {
            res.status(401).send('Користувач ВЖЕ існує');
        }
    }

    async login(req, res) {

        let user_login = req.body.username;
        let user_password = req.body.password;

        if (db.findUser(user_login)) {

            if (db.checkPassword(user_login, user_password)) {
                // тут генерується та відправляється токен доступу для /btcRate
                // детальнe налаштування токену відсутнє
                return res.status(200).json({
                    login: user_login,
                    token: jwt.sign({ login: user_login }, tokenKey),
                })
            } else {
                res.status(401).send('Невірний пароль');
            }
        } else {
            res.status(404).send('Користувача не знайдено');
        }
    }

    async bitcoin(req, res) {

        if (req.user) {

            btcSaveNewRate();

            res.status(200).sendFile('btc/btc.json', {root: __dirname});
        } else {
            return res.status(401).send('Користувач не авторизований');
        }
    }
}


module.exports = new Controller();
