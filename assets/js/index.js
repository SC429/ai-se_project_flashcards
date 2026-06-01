import { getDeckByID, fetchedDecks, removeDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { hexToString } from "./colorMap.js";
import { renderDeckView, setCurrentDeck } from "./deck-view.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { getDecks, deleteDeck } from "./api.js";
import { showError } from "./new-deck-view.js";

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
const aboutSection = document.querySelector('#about');

/**
 * Clone the deck template for dynamic use
 * @param {Object} deck 
 * @returns {Object} deckClone
 * */

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
    linkEl.setAttribute('href', `#deck/${deck._id}`);
    linkEl.addEventListener('click', () => {
        setCurrentDeck(deck);
    });

    deleteBtn.setAttribute('data-deckId', deck._id);
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // ensures that the click event doesn't also trigger the parent element event listener
        event.preventDefault(); // prevent the page from reloading when the button is clicked
        deleteDeck(deck._id).then(() => {
            cardEl.remove();
            removeDeckByID(deck._id);
            if (window.location.hash === `#deck/${deck._id}`) {
                window.location.hash = '#home';
            }
        }).catch((error) => {
            showError("There was an error deleting the deck. Please try again. " + error);
        });
    });

    return deckClone;
}

/**
 * Render the initial view when loading into the webpage
 * @returns {void}
 */

function renderGallery() {
    deckListEl.replaceChildren();
    fetchedDecks.forEach((deck) => {
        deckListEl.appendChild(createDeckEl(deck));
    });
}

function renderHome() {
    deckListEl.replaceChildren();
    newDeckBtn.style.display = 'none'; // hide the new deck button until decks are loaded

    getDecks().then((decks) => {
        fetchedDecks.push(...decks);
        renderGallery();
    }).catch((error) => {
        showError("There was an error loading the decks. Please try again. " + error);
    }).finally(() => {
        renderSection();

        // show the new deck button after decks are loaded
        newDeckBtn.style.display = '';
        newDeckBtn.addEventListener('click', () => {
            window.location.hash = '#new-deck';
        });
    });
}


/**
 * Display the correct section based on hashing
 * @param {Object} sectionToShow
 * @returns {void}
 */

function showSection(sectionToShow) {
    [homeSection, aboutSection, deckViewSection, carouselSection, notFoundSection, newDeckViewSection].forEach((section) => {
        if (section) section.style.display = 'none';
    });
    if (sectionToShow) sectionToShow.style.display = '';
}

/**
 * A helper function to render the page based on if mobile view or desktop view.
 * It calls showSection() based on the window hash.
 * @returns {void}
 */

function renderSection() {
    const hash = window.location.hash;

    if (hash === '' || hash === '#home' || hash === '#decks') {
        pageEl.classList.remove('page_no-mobile-bar');
        renderGallery();
        showSection(homeSection);
        return;
    }

    if (hash === '#about') {
        pageEl.classList.remove('page_no-mobile-bar');
        showSection(aboutSection);
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
        setupNewDeckForm();
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

/**
 * It sets up the new form view for adding a new deck.
 * @returns {void}
 */

function setupNewDeckForm() {
    const textarea = newDeckViewSection.querySelector('#deck-data');
    const submitBtn = newDeckViewSection.querySelector('.new-deck-view__submit-btn');
    const colorInput = newDeckViewSection.querySelectorAll('.new-deck-view__color-input');
    if (colorInput) {
        colorInput.forEach(input => {
            input.checked = false;
        });
        colorInput[0].checked = true; // set the default color to the first option
    };
    textarea.value = '';
    submitBtn.classList.remove('new-deck-view__submit-btn_active');
    submitBtn.disabled = true;

    textarea.addEventListener('input', () => {
        submitBtn.classList.toggle('new-deck-view__submit-btn_active', textarea.value.trim().length > 0);
    });
}

renderHome();

// render the section if browser's hash change
window.addEventListener('hashchange', renderSection);
