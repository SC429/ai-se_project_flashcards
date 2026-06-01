import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";

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

/**
 * Disable the submit button to prevent multiple submissions while processing the form.
 * This function can be called after the form is submitted and while waiting for the API response.
 * It adds a disabled attribute to the submit button and applies a CSS class for visual feedback.
 *
 * @returns {void}
 */
export function disableSubmitBtn() {
    submitBtn.disabled = true;
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
        name: jsonData.name,
        color: colorValue,
        cards: jsonData.cards
    }).then((newDeck) => {
        newDeck.cards = jsonData.cards; // ensure cards are included in the new deck object if the API response doesn't include them
        fetchedDecks.push(newDeck);
        window.location.hash = `#deck/${newDeck._id}`;
    }).catch((error) => {
        console.error("Error adding deck:", error);
        showError("There was an error saving your deck. Please try again.");
    });
});

const modal = document.querySelector('#modal__container');
const modalErrorMsg = modal.querySelector('.modal__error-msg');
const modalCloseBtn = modal.querySelector('.modal__close-btn');

/**
 * Open a modal dialog by adding a CSS class to make it visible. This can be used to display error messages or other important information to the user.
 * @param {Object} modalEl - The DOM element representing the modal dialog to be opened.
 * @returns {void}
 */
function openModal(modal) {
    modal.classList.add("modal_visible");
}

/**
 * Close a modal dialog by removing the CSS class that makes it visible. This can be used to hide the modal after the user has acknowledged the message or taken an action.
 * @param {Object} modalEl - The DOM element representing the modal dialog to be closed.
 * @returns {void}
 */
function closeModal(modal) {
    modal.classList.remove("modal_visible");
}

modalCloseBtn.addEventListener("click", function(event) {
    event.preventDefault();
    closeModal(modal);
})

/**
 * Display an error message in a modal dialog. This function can be called whenever there is an error that needs to be communicated to the user, such as form validation errors or API request failures.
 * @param {string} msg - The error message to be displayed in the modal dialog.
 * @returns {void}
 */
export function showError(msg) {
    modalErrorMsg.textContent = msg;
    openModal(modal);
}
