import { fetchData, fetchAll } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Eventos de búsqueda (Naves)
  if (document.getElementById("searchStarshipBtn")) {
    const starshipSearch = document.getElementById("starshipSearch");
    const starshipResults = document.getElementById("starshipResults");
    document
      .getElementById("searchStarshipBtn")
      .addEventListener("click", function () {
        const searchTerm = starshipSearch.value.trim();
        if (searchTerm) {
          fetchData("starships", searchTerm, starshipResults);
        } else {
          starshipResults.innerHTML =
            "Por favor, introduce un nombre para buscar.";
        }
      });
  }
  // Evento para buscar todos las naves
  if (document.getElementById("searchAllBtn")) {
    const starshipResults = document.getElementById("starshipResults");
    if (starshipResults) {
      document
        .getElementById("searchAllBtn")
        .addEventListener("click", function () {
          fetchAll("starships", starshipResults);
        });
    }
  }
});
