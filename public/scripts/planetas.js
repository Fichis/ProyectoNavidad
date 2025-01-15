import { fetchData, fetchAll } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Eventos de búsqueda (Planetas)
  if (document.getElementById("searchPlanetBtn")) {
    const planetSearch = document.getElementById("planetSearch");
    const planetResults = document.getElementById("planetResults");
    document
      .getElementById("searchPlanetBtn")
      .addEventListener("click", function () {
        const searchTerm = planetSearch.value.trim();
        if (searchTerm) {
          fetchData("planets", searchTerm, planetResults);
        } else {
          planetResults.innerHTML =
            "Por favor, introduce un nombre para buscar.";
        }
      });
  }
  // Evento para buscar todos los planetas
  if (document.getElementById("searchAllBtn")) {
    const planetResults = document.getElementById("planetResults");
    if (planetResults) {
      document
        .getElementById("searchAllBtn")
        .addEventListener("click", function () {
          fetchAll("planets", planetResults);
        });
    }
  }
});
