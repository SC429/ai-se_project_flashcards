import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";
import { renderDeckView } from "./deck-view.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
* Returns a consistent lowercase hex color string with a leading "#".
* Accepts values with or without a leading "#". Returns "#64d583" as a
* fallback if the value is missing or not a valid 6-digit hex.
*
* @param {string|undefined} color
* @returns {string}
*/
function normalizeColor(color) {
    if (!color) return "#64d583";
    const hex = color.startsWith("#") ? color.slice(1) : color;
    if (!HEX_DIGITS.test(hex)) return "#64d583";
    return "#" + hex.toLowerCase();
}

const form = document.querySelector('#new-deck-form');
const submitBtn = form.querySelector('.new-deck-view__submit-btn');
// const textarea = form.querySelector('#deck-data');

// console.log(textarea);

export function disableSubmitBtn() {
    submitBtn.disabled = false;
}

form.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);
    let jsonData = null;
    try {
        jsonData = JSON.parse(formValues["deck-data"]);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        showError("Invalid JSON format. Please correct it and try again.");
        return;
    }

    if (typeof jsonData["name"] !== "string" || jsonData["name"].length < 2 || jsonData["name"].length > 80) {
        showError("Deck name must be a string between 2 and 80 characters.");
        return;
    }

    if (!Array.isArray(jsonData["cards"])) {
        showError("Deck cards must be an array.");
        return;
    }

    const colorValue = normalizeColor(formValues.color);

    if (typeof jsonData.color === "string" && jsonData.color.toLowerCase() !== colorValue) {
        showError(`The "color" in your JSON (${jsonData.color}) doesn't match the color picker (${colorValue}). Please update one to match the other.`);
        return;
    }

    addDeck({
        color: colorValue,
        name: jsonData.name,
        cards: jsonData.cards
    }).then((newDeck) => {
        fetchedDecks.push({ ...newDeck, cards: newDeck.cards ?? jsonData.cards });
        window.location.hash = `#deck/${newDeck._id}`;
    }).catch((error) => {
        console.error("Error adding deck:", error);
        showError("There was an error saving your deck. Please try again.");
    });
});

const modal = document.querySelector('#modal__container');
const modalErrorMsg = modal.querySelector('.modal__error-msg');
const modalCloseBtn = modal.querySelector('.modal__close-btn');

function openModal(modal) {
    modal.classList.add("modal_visible");
}

function closeModal(modal) {
    modal.classList.remove("modal_visible");
}

modalCloseBtn.addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(modal);
})

function showError(msg) {
    modalErrorMsg.textContent = msg;
    openModal(modal);
}
