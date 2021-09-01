'use strict';

const makeBlue = () => {
    const header = document.querySelector('.header');
    header.style.color = '#0000cc';
}

const makeBigger = () => {
    const header = document.querySelector('.header');
    header.style.fontSize = '50px';
}

const button = document.querySelector('button');
button.addEventListener('click', (event) => {
    makeBlue();
    event.stopImmediatePropagation();
}, false);

button.addEventListener('click', (event) => {
    makeBigger();
}, false);