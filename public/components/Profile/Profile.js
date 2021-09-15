import {RENDER_METHODS} from "../../constants.js";
import {imgsFromImagesURLs} from "../../utils/images.js";

export default class ProfileComponent {
    #parent
    #data

    constructor(parent) {
        this.#parent = parent;
    }

    set data(data) {
        this.#data = data;
    }

    #renderDOM() {
        const {age, score, images} = this.#data;
        const profileView =  document.createElement('div');
        const span = document.createElement('span');
        span.textContent = `Мне ${age} и я крутой на ${score} очков`;

        profileView.appendChild(span);

        const back = document.createElement('a');
        back.href = '/menu';
        back.textContent = 'Назад';
        back.dataset.section = 'menu';

        profileView.appendChild(back);

        if (images && Array.isArray(images)) {
            const div = document.createElement('div');
            profileView.appendChild(div);

            images.forEach((imageSrc) => {
                div.innerHTML += `<img src="${imageSrc}"/>`;
            })
        }

        this.#parent.appendChild(profileView)
    }

    #renderString() {
        const {age, score, images} = this.#data;
        const profileView = document.createElement('div');
        profileView.innerHTML = `
            <span class="profile__text">Мне ${age} и я крутой на ${score} очков</span>
            <a href="/menu" data-section="menu">Назад</a>
            ${(images && Array.isArray(images) && imgsFromImagesURLs(images)) ?? ''}
        `;
        this.#parent.appendChild(profileView);
    }

    render(renderMethod = RENDER_METHODS.DOM) {
        switch (renderMethod) {
            case RENDER_METHODS.STRING:
                this.#renderString();
                break;
            case RENDER_METHODS.DOM:
            default:
                this.#renderDOM();
        }
    }
}
