'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

const users = {
    'd.dorofeev@corp.mail.ru': {
        email: 'd.dorofeev@corp.mail.ru',
        password: 'password',
        age: 21,
        score: 3,
    },
    's.volodin@corp.mail.ru': {
        email: 's.volodin@corp.mail.ru',
        password: 'password',
        age: 24,
        score: 100500,
        images: [
            '/server/images/241239898_509534673414004_2670816557845118956_n.jpeg'
        ]
    },
    'aleksandr.tsvetkov@corp.mail.ru': {
        email: 'aleksandr.tsvetkov@corp.mail.ru',
        password: 'password',
        age: 27,
        score: 72,
        images: [
            'https://scontent-arn2-1.cdninstagram.com/v/t51.2885-15/e35/19228555_310775326029169_611501797038620672_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com&_nc_cat=101&_nc_ohc=CSWYhhZaI30AX-8TUvX&edm=AP_V10EBAAAA&ccb=7-4&oh=eec5a05513bbcbdf4e4ed5810fb67c4a&oe=613FF7EB&_nc_sid=4f375e',
            'https://scontent-arn2-1.cdninstagram.com/v/t51.2885-15/e35/16583858_168051673696142_846500378588479488_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=h_mjiDqypmwAX_Lz_ea&edm=AP_V10EBAAAA&ccb=7-4&oh=e77934079b4d97b532b3d205ac6e79e0&oe=6140875B&_nc_sid=4f375e',
            'https://scontent-arn2-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/s750x750/13259619_1728960653986462_1525963650_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com&_nc_cat=110&_nc_ohc=ZYeN4ZWTY6oAX9UqUjI&tn=pmbb9kppgOfU9eNB&edm=AP_V10EBAAAA&ccb=7-4&oh=0acdeffc5d5f4e3bcdb984f1c6727be1&oe=61405C3A&_nc_sid=4f375e',
        ],
    },
    'a.ostapenko@corp.mail.ru': {
        email: 'a.ostapenko@corp.mail.ru',
        password: 'password',
        age: 21,
        score: 72,
    },
};
const ids = {};

app.post('/signup', function (req, res) {
    const password = req.body.password;
    const email = req.body.email;
    const age = req.body.age;
    if (
        !password || !email || !age ||
        !password.match(/^\S{4,}$/) ||
        !email.match(/@/) ||
        !(typeof age === 'number' && age > 10 && age < 100)
    ) {
        return res.status(400).json({error: 'Не валидные данные пользователя'});
    }
    if (users[email]) {
        return res.status(400).json({error: 'Пользователь уже существует'});
    }

    const id = uuid();
    const user = {password, email, age, score: 0, images: []};
    ids[id] = email;
    users[email] = user;

    res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(201).json({id});
});

app.post('/login', function (req, res) {
    const password = req.body.password;
    const email = req.body.email;
    if (!password || !email) {
        return res.status(400).json({error: 'Не указан E-Mail или пароль'});
    }
    if (!users[email] || users[email].password !== password) {
        return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
    }

    const id = uuid();
    ids[id] = email;

    res.cookie('podvorot', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).json({id});
});

app.get('/me', function (req, res) {
    const id = req.cookies['podvorot'];
    const email = ids[id];
    if (!email || !users[email]) {
        return res.status(401).end();
    }

    users[email].score += 1;

    res.json(users[email]);
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
