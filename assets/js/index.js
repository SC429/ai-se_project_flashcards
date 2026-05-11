import { decks, getDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { hexToString } from "./colorMap.js";

// select the template 
const templateEl = document.querySelector('#deck-template');
const deckListEl = document.querySelector('.gallery__list ul');

if (!templateEl || !deckListEl) {
    console.log('Element not found');
} else {
    const templateClone = templateEl.content.cloneNode(true); // clone the template
    templateEl.remove(); // removes the original template element from the DOM

    const newDeckBtn = document.querySelector('.gallery__new-deck-btn');
    const newDeckBtnClone = newDeckBtn.cloneNode(true);
    newDeckBtn.remove();

    // create each deck item
    function createDeckEl(item) {
        const tempEl = templateClone.cloneNode(true);
        const titleEl = tempEl.querySelector('.card__title');
        if (titleEl) titleEl.textContent = item.name;
        const countEl = tempEl.querySelector('.card__count');
        const delBtn = tempEl.querySelector('.card__delete-btn');
        if (delBtn) {
            delBtn.setAttribute('data-deckId', item.id);
            delBtn.addEventListener('click', (element) => {
                const deckEl = delBtn.closest('.card');
                try {
                    element.stopPropagation(); // prevent the click event from reloading the page
                    deckEl.remove(); // remove the deck element
                }
                catch (error) {                    
                    console.error(`Can't remove ${item.name} :`, error);
                }
            });
        }

        const linkEl = tempEl.querySelector('.card__link');
        if (linkEl) linkEl.setAttribute('href', `#carousel/${item.id}`);

        if (countEl) countEl.textContent = `${item.cards ? item.cards.length : 0} cards`;
        return tempEl;
    }

    // render each deck with respected color and content
    function renderDeckEl(item) {
        const deckEl = createDeckEl(item);
        const deckClone = deckEl.querySelector('.card');
        deckClone.classList.add(`card_color_${hexToString(item.color)}`);
        deckListEl.appendChild(deckEl);
        return deckEl;
    }

    // loops through the decks and renders them on the page
    decks.forEach((item) => {
        const linkEl = renderDeckEl(item);
        linkEl.addEventListener('click', () => {
            linkEl.setAttribute('href', `#carousel/${item.id}`);
        });
    });

    // append the delete button to the end of the list
    deckListEl.appendChild(newDeckBtnClone);

    const home = document.querySelector('.page__main-content');
    const aboutSection = document.querySelector('.about');
    const decksSection = document.querySelector('.gallery');
    const notFoundSection = document.querySelector('.not-found');
    const carouselSection = document.querySelector('.carousel');

    // helper function for rendering
    function renderPage(homePage=None, about=None, decks=None, notFound=None, carousel=None) {
        if (home) home.classList.remove("carousel__main-page");
        if (aboutSection) aboutSection.style.display = 'none';
        if (decksSection) decksSection.style.display = 'none';
        if (notFoundSection) notFoundSection.style.display = 'none';
        if (carouselSection) carouselSection.style.display = 'none';

        if (homePage || decks) {
            if (decksSection) decksSection.style.display = 'block';
        }

        if (about && aboutSection) aboutSection.style.display = 'block';

        if (notFound && notFoundSection) notFoundSection.style.display = 'block';

        if (carousel && carouselSection) {
            if (home) home.classList.add("carousel_main-page");
            carouselSection.style.display = 'flex';
        }
    }

    // render each section based on hash
    function renderSection() {
        let hash = window.location.hash;
        if (hash === '#home' || hash === 'index.html' || hash === '') {
            renderPage(true, false, false, false, false);
            console.log('Rendering home section');
        } else if (hash === '#about') {
            renderPage(false, true, false, false, false);
            console.log('Rendering about section');
        } else if (hash === '#decks') {
            renderPage(false, false, true, false, false);
            console.log('Rendering decks section');
        } else if (hash === '#not-found') {
            renderPage(false, false, false, true, false);
            console.log('Rendering not-found section');
        } else if (hash.startsWith("#carousel/")) {
            renderPage(false, false, false, false, true);

            // get deckID from the http address
            const deck = getDeckByID(hash.split("/")[1]);
            if (deck) {
                renderCarouselView(deck);
                console.log('Rendering carousel section for deck:', deck);
            }
        } else {
            window.location.hash = '#not-found'; // redirect to not-found if hash is invalid
        }
    }

    window.addEventListener("DOMContentLoaded", renderSection);
    window.addEventListener("hashchange", renderSection);

    // check the correct number of decks 
    console.log('Deck total: ', decks.length);
}