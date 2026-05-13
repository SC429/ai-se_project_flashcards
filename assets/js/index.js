import { decks, getDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { hexToString } from "./colorMap.js";
import { renderDeckView, setCurrentDeck } from "./deck-view.js";

const homeSection = document.querySelector('#home');
const deckViewSection = document.querySelector('#deck-view');
const carouselSection = document.querySelector('.carousel');
const notFoundSection = document.querySelector('.not-found');

const deckTemplate = document.querySelector('#deck-template');

const deckListEl = homeSection.querySelector('.gallery__list ul');

// build a single deck tile for the home gallery
function createDeckEl(deck) {
    const clone = deckTemplate.content.cloneNode(true);
    const cardEl = clone.querySelector('.card');
    const linkEl = clone.querySelector('.card__link');
    const titleEl = clone.querySelector('.card__title');
    const countEl = clone.querySelector('.card__count');
    const deleteBtn = clone.querySelector('.card__delete-btn');

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

    return clone;
}

function renderHome() {
    deckListEl.replaceChildren();
    decks.forEach((deck) => {
        deckListEl.appendChild(createDeckEl(deck));
    });
}

function showSection(sectionToShow) {
    [homeSection, deckViewSection, carouselSection, notFoundSection].forEach((section) => {
        if (section) section.style.display = 'none';
    });
    if (sectionToShow) sectionToShow.style.display = '';
}

function renderSection() {
    const hash = window.location.hash;

    if (hash === '' || hash === '#home' || hash === '#decks') {
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
            renderCarouselView(deck);
            showSection(carouselSection);
        } else {
            window.location.hash = '#not-found';
        }
        return;
    }

    if (hash === '#not-found') {
        showSection(notFoundSection);
        return;
    }

    window.location.hash = '#not-found';
}

renderHome();
renderSection();
window.addEventListener('hashchange', renderSection);
