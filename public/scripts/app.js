import {getImageByName, fetchSaveArray} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Comprobamos si el usuario está logueado
  const username = localStorage.getItem("username");
  const userDisplay = document.getElementById("usernameDisplay");
  const logoutBtn = document.getElementById("logoutBtn");

  if (username) {
    userDisplay.textContent = username;
  } else {
    window.location.href = "index.html"; // Redirigir si no está logueado
  }

  // Cerrar sesión
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("username");
    window.location.href = "index.html";
  });

  
  // Generar películas
  if (document.getElementById("moviesContainer")) {
    // Usamos una función asíncrona para esperar a que se resuelva la promesa
    async function obtenerPeliculas() {
      const moviesArray = await fetchSaveArray(
        "https://www.swapi.tech/api/films"
      );

      // Obtener el contenedor donde vamos a insertar los elementos
      const moviesContainer = document.getElementById("moviesContainer");

      // Limpiar cualquier contenido previo dentro del contenedor
      moviesContainer.innerHTML = "";

      // Iterar sobre el array de películas y crear los elementos HTML correspondientes
      moviesArray.forEach((movie) => {
        // Crear un contenedor para cada película
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie"); // Puedes agregar clases si lo deseas

        // Crear un título para la película
        const titleElement = document.createElement("h2");
        titleElement.textContent = `${movie.properties.title}`;

        // Añadir la imagen de la película
        const img = document.createElement("img");
        img.src = getImageByName(movie.properties.title);
        img.alt = movie.properties.title;

        // Crear un párrafo para el director
        const directorElement = document.createElement("p");
        directorElement.textContent = `Director: ${movie.properties.director}`;

        // Crear un párrafo para la fecha de emisión
        const releaseDateElement = document.createElement("p");
        releaseDateElement.textContent = `Fecha de emisión: ${movie.properties.release_date}`;

        // Agregar los elementos creados al contenedor de la película
        movieDiv.appendChild(titleElement);
        movieDiv.appendChild(img);
        movieDiv.appendChild(directorElement);
        movieDiv.appendChild(releaseDateElement);

        // Agregar evento para abrir el modal al hacer clic en la película
        movieDiv.addEventListener("click", () => openMovieModal(movie));

        // Finalmente, agregar el div de la película al contenedor principal
        moviesContainer.appendChild(movieDiv);
      });
    }

    obtenerPeliculas(); // Llamamos a la función para obtener y mostrar las películas

    // Función para abrir el modal con la información de la película
    async function openMovieModal(movie) {
      const modal = document.getElementById("movieModal");
      const modalTitle = document.getElementById("modalTitle");
      const modalImage = document.getElementById("modalImage");
      const modalDirector = document.getElementById("modalDirector");
      const modalOpening = document.getElementById("modalOpening");
      const modalPrice = document.getElementById("modalPrice");
      const modalReleaseDate = document.getElementById("modalReleaseDate");
      const modalCharacters = document.getElementById("modalCharacters");
      const modalPlanets = document.getElementById("modalPlanets");
      const modalSpaceships = document.getElementById("modalSpaceships");
      const modalSpecies = document.getElementById("modalSpecies");
      const modalVehicles = document.getElementById("modalVehicles");

      // Rellenar el modal con la información de la película
      modalTitle.textContent = movie.properties.title;
      modalImage.src = getImageByName(movie.properties.title);
      modalImage.alt = movie.properties.title;
      modalDirector.textContent = movie.properties.director;
      modalOpening.textContent = movie.properties.opening_crawl;
      modalPrice.textContent = "10€";
      modalReleaseDate.textContent = movie.properties.release_date;

      // Limpiar listas de detalles previos
      modalCharacters.innerHTML = "";
      modalPlanets.innerHTML = "";
      modalSpaceships.innerHTML = "";
      modalSpecies.innerHTML = "";
      modalVehicles.innerHTML = "";

      // Función para agregar un retraso en la ejecución
      const delay = (ms) => new Promise((result) => setTimeout(result, ms));

      // Función principal para hacer las solicitudes
      async function fetchFromArray(urls, responseContainer) {
        for (const url of urls) {
          try {
            // Realiza la solicitud
            const response = await fetch(url);
            const data = await response.json();

            // Muestra el nombre del dato obtenido
            /* console.log(data.result.properties.name); */
            const li = document.createElement("li");
            li.textContent = data.result.properties.name;
            responseContainer.appendChild(li);

            // Espera 1 segundo (1000ms) antes de hacer la siguiente solicitud
            await delay(50);
          } catch (error) {
            console.error(`Error al obtener datos de ${url}: `, error);
          }
        }
      }

      // Agregar personajes a las peliculas
      const charactersData = movie.properties.characters;
      /* console.log(charactersData); */
      if (charactersData) {
        // Llamar a la función para ejecutar las solicitudes
        fetchFromArray(charactersData, modalCharacters);
      }

      // Agregar planetas
      const planetsData = movie.properties.planets;
      /* console.log(planetsData); */
      if (planetsData) {
        // Llamar a la función para ejecutar las solicitudes
        fetchFromArray(planetsData, modalPlanets);
      }

      // Agregar naves espaciales
      const starshipsData = movie.properties.starships;
      /* console.log(starshipsData); */
      if (starshipsData) {
        // Llamar a la función para ejecutar las solicitudes
        fetchFromArray(starshipsData, modalSpaceships);
      }

      // Agregar especies
      const speciesData = movie.properties.species;
      /* console.log(speciesData); */
      if (speciesData) {
        // Llamar a la función para ejecutar las solicitudes
        fetchFromArray(speciesData, modalSpecies);
      }

      // Agregar vehículos
      const vehiclesData = movie.properties.vehicles;
      /* console.log(vehiclesData); */
      if (vehiclesData) {
        // Llamar a la función para ejecutar las solicitudes
        fetchFromArray(vehiclesData, modalVehicles);
      }

      // Mostrar el modal
      modal.style.display = "block";

      // Cerrar el modal
      const closeBtn = document.querySelector(".close-btn");
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      // Cerrar el modal si el usuario hace clic fuera de él
      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }
});