import { decks, getDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { hexToString } from "./colorMap.js";
import { renderDeckView, setCurrentDeck } from "./deck-view.js";
import { disableSubmitBtn } from "./new-deck-view.js";

// select the elements for each section
const pageEl = document.querySelector('.page');
const homeSection = document.querySelector('#home');
const deckViewSection = document.querySelector('#deck-view');
const newDeckViewSection = document.querySelector('#new-deck-view');
const carouselSection = document.querySelector('.carousel');
const notFoundSection = document.querySelector('.not-found');
const deckTemplate = document.querySelector('#deck-template');
const deckListEl = homeSection.querySelector('.gallery__list ul');
const newDeckBtn = document.querySelector('#home .gallery__new-deck-btn');

// build a single deck tile for the home gallery
function createDeckEl(deck) {
    const deckClone = deckTemplate.content.cloneNode(true);
    const cardEl = deckClone.querySelector('.card');
    const linkEl = deckClone.querySelector('.card__link');
    const titleEl = deckClone.querySelector('.card__title');
    const countEl = deckClone.querySelector('.card__count');
    const deleteBtn = deckClone.querySelector('.card__delete-btn');

    cardEl.classList.add(`card_color_${hexToString(deck.color)}`);
    titleEl.textContent = deck.name;
    countEl.textContent = `${deck.cards ? deck.cards.length : 0} cards`;
    linkEl.setAttribute('href', `#deck/${deck.id}`);
    linkEl.addEventListener('click', () => {
        setCurrentDeck(deck);
    });

    deleteBtn.setAttribute('data-deckId', deck.id);
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        cardEl.remove();
    });

    return deckClone;
}

function renderHome() {
    deckListEl.replaceChildren();
    decks.forEach((deck) => {
        deckListEl.appendChild(createDeckEl(deck));
    });

    newDeckBtn.addEventListener('click', () => {
        window.location.hash = '#new-deck';
    });
}

function showSection(sectionToShow) {
    [homeSection, deckViewSection, carouselSection, notFoundSection, newDeckViewSection].forEach((section) => {
        if (section) section.style.display = 'none';
    });
    if (sectionToShow) sectionToShow.style.display = '';
}

function renderSection() {
    const hash = window.location.hash;

    if (hash === '' || hash === '#home' || hash === '#decks') {
        pageEl.classList.remove('page_no-mobile-bar');
        showSection(homeSection);
        return;
    }

    if (hash.startsWith('#deck/')) {
        const deck = getDeckByID(hash.split('/')[1]);
        if (deck) {
            renderDeckView(deck);
            showSection(deckViewSection);
        } else {
            window.location.hash = '#not-found';
        }
        return;
    }

    if (hash.startsWith('#carousel/')) {
        const deck = getDeckByID(hash.split('/')[1]);
        if (deck) {
            pageEl.classList.add('page_no-mobile-bar');
            renderCarouselView(deck);
            showSection(carouselSection);
        } else {
            window.location.hash = '#not-found';
        }
        return;
    }

    if (hash === '#new-deck') {
        pageEl.classList.add('page_no-mobile-bar');
        showSection(newDeckViewSection);
        disableSubmitBtn();
        return;
    }

    if (hash === '#not-found') {
        pageEl.classList.add('page_no-mobile-bar');
        showSection(notFoundSection);
        return;
    }

    window.location.hash = '#not-found';
}

function setupNewDeckForm() {
    const textarea = newDeckViewSection.querySelector('#deck-name');
    const submitBtn = newDeckViewSection.querySelector('.new-deck-view__submit-btn');

    textarea.addEventListener('input', () => {
        submitBtn.classList.toggle('new-deck-view__submit-btn_active', textarea.value.trim().length > 0);
    });
}

renderHome();
setupNewDeckForm();
renderSection();

// render the section if browser's hash change
window.addEventListener('hashchange', renderSection);
