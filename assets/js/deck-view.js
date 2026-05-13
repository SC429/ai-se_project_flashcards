import { hexToString } from "./colorMap.js";

const deckViewSection = document.querySelector('#deck-view');
const cardTemplate = document.querySelector('#card-template');
const cardListEl = deckViewSection.querySelector('.gallery__list ul');
const deckViewTitle = deckViewSection.querySelector('.gallery__title');
const practiceBtn = deckViewSection.querySelector('.practice-btn');

let currentDeck = null;

export function setCurrentDeck(deck) {
    currentDeck = deck;
}

practiceBtn.addEventListener('click', () => {
    window.location.hash = `#carousel/${currentDeck.id}`;
});

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

export function renderDeckView(deck) {
    deckViewTitle.textContent = deck.name;

    cardListEl.replaceChildren();
    deck.cards.forEach((card) => {
        cardListEl.appendChild(createCardEl(card, deck));
    });
}
