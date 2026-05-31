const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
    "Content-Type": "application/json",
    "Authorization": "019e7a6b-8482-733c-9605-4c86063c4dea"
}

/**
 * Helper function for checking the status of a http request
 * @param {Boolean} res
 * @returns {Array, Promise.object}
 */

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Submit a GET request to retrieve the decks
 * @returns {Array}
 */

export function getDecks() {
   return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Submit a DELETE request to delete the deck based on deck ID
 * @param {Number} deckId 
 * @returns {None}
 */

export function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers
  }).then(processResponse);
}

/**
 * Submit a POST request to add a new deck
 * @param {String} name
 * @param {String} color
 * @param {Array} cards 
 * @returns {None}
 */

export function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    body: JSON.stringify({ name, color, cards }),
    headers
  }).then(processResponse);
}