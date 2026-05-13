import { decks, getDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { hexToString } from "./colorMap.js";

const homeSection = document.querySelector('#home');
const deckViewSection = document.querySelector('#deck-view');
const carouselSection = document.querySelector('.carousel');
const notFoundSection = document.querySelector('.not-found');

const deckTemplate = document.querySelector('#deck-template');
const cardTemplate = document.querySelector('#card-template');

const deckListEl = homeSection.querySelector('.gallery__list ul');
const cardListEl = deckViewSection.querySelector('.gallery__list ul');

const deckViewTitle = deckViewSection.querySelector('.gallery__title');
const practiceBtn = deckViewSection.querySelector('.practice-btn');

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

    deleteBtn.setAttribute('data-deckId', deck.id);
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        cardEl.remove();
    });

    return clone;
}

// build a single flashcard tile for the deck view
function createCardEl(card, deck) {
    const clone = cardTemplate.content.cloneNode(true);
    const cardEl = clone.querySelector('.card');
    const titleEl = clone.querySelector('.card__title');
    const flipBtn = clone.querySelector('.card__flip-btn');
    const deleteBtn = clone.querySelector('.card__delete-btn');

    const baseColorClass = `card_color_${hexToString(deck.color)}`;
    cardEl.classList.add(baseColorClass);
    titleEl.textContent = card.question;

    let showingQuestion = true;
    flipBtn.addEventListener('click', () => {
        showingQuestion = !showingQuestion;
        if (showingQuestion) {
            titleEl.textContent = card.question;
            cardEl.classList.remove('card_color_white');
            cardEl.classList.add(baseColorClass);
        } else {
            titleEl.textContent = card.answer;
            cardEl.classList.remove(baseColorClass);
            cardEl.classList.add('card_color_white');
        }
    });

    deleteBtn.addEventListener('click', () => {
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

function renderDeckView(deck) {
    deckViewTitle.textContent = deck.name;
    practiceBtn.onclick = () => {
        window.location.hash = `#carousel/${deck.id}`;
    };

    cardListEl.replaceChildren();
    deck.cards.forEach((card) => {
        cardListEl.appendChild(createCardEl(card, deck));
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
