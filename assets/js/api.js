const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";
const headers = {
    "Content-Type": "application/json",
    "Authorization": "019e7a6b-8482-733c-9605-4c86063c4dea"
}

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

export function getDecks() {
   return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

export function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers: { headers}
  }).then(processResponse);
}