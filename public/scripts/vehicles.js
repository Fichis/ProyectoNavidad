import { fetchData, fetchAll } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Eventos de búsqueda (Vehiculos)
  if (document.getElementById("searchVehicleBtn")) {
    const vehicleSearch = document.getElementById("vehicleSearch");
    const vehicleResults = document.getElementById("vehicleResults");
    document
      .getElementById("searchVehicleBtn")
      .addEventListener("click", function () {
        const searchTerm = vehicleSearch.value.trim();
        if (searchTerm) {
          fetchData("vehicles", searchTerm, vehicleResults);
        } else {
          vehicleResults.innerHTML =
            "Por favor, introduce un nombre para buscar.";
        }
      });
  }

  // Evento para buscar todos los vehículos
  if (document.getElementById("searchAllBtn")) {
    const vehicleResults = document.getElementById("vehicleResults");
    if (vehicleResults) {
      document
        .getElementById("searchAllBtn")
        .addEventListener("click", function () {
          fetchAll("vehicles", vehicleResults);
        });
    }
  }
});
