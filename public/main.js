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

function ajax(method, url, body = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();
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

        ajax(
          'POST',
          '/login',
            {email, password},
            (status) => {
              if (status === 200) {
                  profilePage();
                  return;
              }

              alert('НЕ получилось не фартануло');
            }
        );

    })

    root.appendChild(form);
}

function profilePage() {
    root.innerHTML = '';

    ajax(
        'GET',
        '/me',
        null,
        (status, responseText) => {
            let isAuthorized = false;

            if (status === 200) {
                isAuthorized = true;
            }

            if (isAuthorized) {
                const {age, score, images} = JSON.parse(responseText);

                const span = document.createElement('span');
                span.textContent = `Мне ${age} и я крутой на ${score} очков`;

                root.appendChild(span);

                const back = document.createElement('a');
                back.href = '/menu';
                back.textContent = 'Назад';
                back.dataset.section = 'menu';

                root.appendChild(back);

                if (images && Array.isArray(images)) {
                    const div = document.createElement('div');
                    root.appendChild(div);

                    images.forEach((imageSrc) => {
                        div.innerHTML += `<img src="${imageSrc}"/>`;
                    })
                }

                return;
            }

            alert('АХТУНГ НЕТ АВТОРИЗАЦИИ');
            loginPage();
        }
    );
}

menuPage();



root.addEventListener('click', e => {
    const {target} = e;

    if (target instanceof HTMLAnchorElement) {
        e.preventDefault();

        configApp[target.dataset.section].open();
    }
})
