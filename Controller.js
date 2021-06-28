const fs = require('fs');
const jwt = require('jsonwebtoken');
const request = require('request');
const {tokenKey} = require('./config.js');
const db = require('./db.js');

// посилання на курс btc
const url_btc = "https://bitpay.com/api/rates";


class Controller {
    // для тестування
    async test(req, res) {
        res.send("Сервер працює");
    }


    // створення запису користувача
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


    // авторизація користувача та надання токену доступу
    async login(req, res) {

        let user_login = req.body.username;
        let user_password = req.body.password;

        // пошук користувача
        if (db.findUser(user_login)) {

            if (db.checkPassword(user_login, user_password)) {
                // тут генерується та відправляється токен доступу для /btcRate
                // детальнe налаштування токену відсутнє
                // для завдання досить самої генерації
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


    // надання інформації про біток авторизованим користувачам
    async bitcoin(req, res) {

        if (req.user) {
            // запит для отримання курсу
            request(url_btc, { json : true}, (err, res, body) => {
                if (err) {
                    return console.log(err);
                } else {
                    // ПЕРЕЗАПИС файлу, де записаний курс btc
                    let info = JSON.stringify(body[150]["rate"], null, '\t');
                    fs.writeFileSync('./btc.json', info);
                }
            })
            // якщо користувач авторизований - надсилаємо файл з курсом btc
            res.status(200).sendFile('btc.json', {root: __dirname});
        } else {
            return res.status(401).send('Користувач не авторизований');
        }
    }
}


module.exports = new Controller();
