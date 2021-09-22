import ProfileComponent from './components/Profile/Profile.js';
import {RENDER_METHODS, AJAX_STATUSES} from './constants.js'
console.log('lol kek');

const root = document.getElementById('root');

const configApp = {
    menu: {
        href: '/menu',
        name: 'Меню',
        open: menuPage,
    },
    signup: {
        href: '/signup',
        name: 'Регистрация',
        open: signupPage,
    },
    login: {
        href: '/login',
        name: 'Авторизация',
        open: loginPage,
    },
    profile: {
        href: '/profile',
        name: 'Профиль',
        open: profilePage,
    },
    about: {
        href: '/about',
        name: 'Контакты',
    },
}

function createInput(type, text, name) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text;

    return input;
}

function menuPage() {
    root.innerHTML = '';

    Object
        .entries(configApp)
        .map(([key, {href, name}]) => {
            const menuElement = document.createElement('a');
            menuElement.href = href;
            menuElement.textContent = name;
            menuElement.dataset.section = key;

            return menuElement;
        })
        .forEach((el) => {
            root.appendChild(el);
        })
    ;
}

function signupPage() {
    root.innerHTML = '';

    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');
    const ageInput = createInput('number', 'Возраст', 'age');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться!';

    const back = document.createElement('a');
    back.href = '/menu';
    back.textContent = 'Назад';
    back.dataset.section = 'menu';

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(ageInput);
    form.appendChild(submitBtn);
    form.appendChild(back);

    root.appendChild(form);
}


function loginPage() {
    root.innerHTML = '';

    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться!';

    const back = document.createElement('a');
    back.href = '/menu';
    back.textContent = 'Назад';
    back.dataset.section = 'menu';


    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(back);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        Ajax.ajaxPost({
            url: '/login',
            body: {email, password},
            callback: (status) => {
                if (status === AJAX_STATUSES.OK) {
                    profilePage();
                    return;
                }

                alert('НЕ получилось не фартануло');
            }
        });
    })

    root.appendChild(form);
}

function profilePage() {
    root.innerHTML = '';
    Ajax.ajaxGet({
        url: '/me',
        callback: (status, responseText) => {
            let isAuthorized = false;

            if (status === AJAX_STATUSES.OK) {
                isAuthorized = true;
            }

            if (isAuthorized) {
                try {
                    const data = JSON.parse(responseText);
                    const profile = new ProfileComponent(root);
                    profile.data = data;
                    profile.render(RENDER_METHODS.DOM);
                } catch (e) {
                    alert('ОШИБКА СЕРВЕРА');
                    loginPage();
                };
                return;
            }

            alert('АХТУНГ НЕТ АВТОРИЗАЦИИ');
            loginPage();
        }
    });
}

menuPage();



root.addEventListener('click', e => {
    const {target} = e;

    if (target instanceof HTMLAnchorElement) {
        e.preventDefault();

        configApp[target.dataset.section].open();
    }
})
