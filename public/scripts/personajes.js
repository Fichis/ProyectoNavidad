import { fetchData, fetchAll } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Eventos de búsqueda (Personajes)
  if (document.getElementById("searchCharacterBtn")) {
    const characterSearch = document.getElementById("characterSearch");
    const characterResults = document.getElementById("characterResults");
    document
      .getElementById("searchCharacterBtn")
      .addEventListener("click", function () {
        const searchTerm = characterSearch.value.trim().toLowerCase();
        if (searchTerm) {
          fetchData("people", searchTerm, characterResults);
        } else {
          characterResults.innerHTML =
            "Por favor, introduce un nombre para buscar.";
        }
      });
  }
  // Evento para buscar todos los personajes
  if (document.getElementById("searchAllBtn")) {
    const characterResults = document.getElementById("characterResults");
    if (characterResults) {
      document
        .getElementById("searchAllBtn")
        .addEventListener("click", function () {
          fetchAll("people", characterResults);
        });
    }
  }
});
