import { decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
* Converts a string to a URL-safe slug: lowercase with any run of
* non-alphanumeric characters replaced by a single hyphen, and no leading or
* trailing hyphens.
*
* @param {string} str
* @returns {string}
*/
function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

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

    const color = normalizeColor(formValues.color);
    const id = `${slugify(jsonData["name"])}-${Date.now()}`;

    decks.push({
        id,
        color,
        name: jsonData["name"],
        cards: jsonData["cards"],
    });

    window.location.hash = "deck/" + id;
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
