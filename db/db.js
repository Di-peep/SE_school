const fs = require('fs');
const path = require('path');
const db = require('./db.json');


function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}


function create(log, pas) {

    if (find(log)) {
        return;
    }

    if (!isString(log) || !isString(pas)) {
        return;
    }

    // запис користувача в оп. пам'ять
    db[log] = pas;

    // запис 'бд' з оп. пам'яті у файл
    let users = JSON.stringify(db, null, '\t');
    fs.writeFileSync('../db/db.json', users);
}


function find(log) {
    if (db[log] !== undefined) {
        return true;
    } else {
        return false;
    }
}


function check(log, pas) {
    if (db[log] === pas) {
        return true;
    } else {
        return false;
    }
}


module.exports = {
    createUser : create,
    findUser : find,
    checkPassword : check
}
