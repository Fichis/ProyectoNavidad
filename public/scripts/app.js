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

  // Función para realizar las búsquedas en la API
  async function fetchData(endpoint, searchTerm, resultContainer) {
    const url = `https://www.swapi.tech/api/${endpoint}/?name=${encodeURIComponent(
      searchTerm
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      resultContainer.innerHTML = "";
      if (data.result && data.result.length > 0) {
        const item = data.result[0]; // Accede solo al primer resultado
        const div = document.createElement("div");
        div.classList.add("result-item");
        const link = document.createElement("button");
        link.textContent = item.properties.name || item.properties.title; // Accede a name o title
        link.addEventListener("click", function () {
          fetchDetails(endpoint, item.properties.url); // Accede a la URL desde properties
        });
        div.appendChild(link);
        resultContainer.appendChild(div);
      } else {
        resultContainer.innerHTML = "No se encontraron resultados.";
      }
    } catch (error) {
      resultContainer.innerHTML =
        "Hubo un error al realizar la búsqueda. Intente nuevamente.";
    }
  }

  // Función para realizar las búsquedas all en la API
  async function fetchAll(endpoint, resultContainer) {
    if (!resultContainer) {
      console.error("El contenedor de resultados no existe.");
      return;
    }

    const url = `https://www.swapi.tech/api/${endpoint}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      const next = data.next; // URL para la siguiente página
      const previous = data.previous; // URL para la página anterior
      const totalPages = data.total_pages || 1; // Total de páginas (opcional)

      resultContainer.innerHTML = "";
      if (data.results && data.results.length > 0) {
        data.results.forEach((item) => {
          const div = document.createElement("div");
          div.classList.add("result-item");
          const link = document.createElement("button");
          link.textContent = item.name;
          link.addEventListener("click", function () {
            fetchDetails(endpoint, item.url);
          });
          div.appendChild(link);
          resultContainer.appendChild(div);
        });

        // Creación de contenedor para los botones de paginación
        const paginationControls = document.createElement("div");
        paginationControls.classList.add("pagination-controls");

        // Botón "Anterior"
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Anterior";
        if (previous) {
          prevBtn.addEventListener("click", function () {
            fetchAllWithUrl(previous, resultContainer); // Llama a fetchAll con la URL anterior
          });
        } else {
          prevBtn.disabled = true; // Desactiva el botón si no hay página anterior
        }
        paginationControls.appendChild(prevBtn);

        // Botón "Siguiente"
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Siguiente";
        if (next) {
          nextBtn.addEventListener("click", function () {
            fetchAllWithUrl(next, resultContainer, endpoint); // Llama a fetchAll con la URL siguiente
          });
        } else {
          nextBtn.disabled = true; // Desactiva el botón si no hay más páginas
        }
        paginationControls.appendChild(nextBtn);

        resultContainer.appendChild(paginationControls); // Añade los controles de paginación al contenedor
      } else {
        resultContainer.innerHTML = "No se encontraron resultados.";
      }
    } catch (error) {
      resultContainer.innerHTML =
        "Hubo un error al realizar la búsqueda. Intente nuevamente.";
    }
  }

  // Función para obtener los detalles de un recurso (personajes, planetas, naves)
  async function fetchDetails(endpoint, resourceUrl) {
    try {
      const response = await fetch(resourceUrl);
      const data = await response.json();
      const detailsContainer = document.getElementById("detailsContainer");

      // Limpia el contenedor de detalles
      detailsContainer.innerHTML = "";

      // Obtén el nombre del personaje, planeta o nave
      const name = data.result.properties.name || data.result.properties.title;

      // Agregar el nombre del personaje, planeta o nave al contenedor de detalles
      const heading = document.createElement("h3");
      heading.textContent = name;
      detailsContainer.appendChild(heading);

      // Crear el contenedor de detalles
      const details = document.createElement("ul");

      // Añadir la imagen del personaje
      const img = document.createElement("img");
      img.src = getImageByName(name); // Usamos la función que mapea el nombre al path de la imagen
      img.alt = name;
      img.style.width = "200px";
      img.style.height = "200px";

      detailsContainer.appendChild(img); // Agregar la imagen al contenedor de detalles

      // Mostrar el resto de propiedades del personaje, planeta o nave
      for (let key in data.result.properties) {
        if (
          data.result.properties[key] &&
          key !== "url" &&
          key !== "homeworld"
        ) {
          if (key === "pilots" || key === "films") {
            const subList = document.createElement("ul");
            for (const url of data.result.properties[key]) {
              const subResponse = await fetch(url);
              const subData = await subResponse.json();

              const subListItem = document.createElement("li");
              subListItem.textContent = `${
                subData.result.properties.name ||
                subData.result.properties.title
              }`;
              subList.appendChild(subListItem);
            }
            const listItem = document.createElement("li");
            listItem.textContent =
              key.charAt(0).toUpperCase() + key.slice(1) + ":";
            listItem.appendChild(subList);
            details.appendChild(listItem);
          } else {
            const listItem = document.createElement("li");
            listItem.textContent = `${
              key.charAt(0).toUpperCase() + key.slice(1)
            }: ${data.result.properties[key]}`;
            details.appendChild(listItem);
          }
        }
      }
      const addToCarritoButton = document.createElement("button");
      const priceContainer = document.createElement("p");
      addToCarritoButton.textContent = "Añadir al carrito"
      console.log(data.result.properties.url);
      if (data.result.properties.url.includes("people")){
        priceContainer.textContent = "Precio: 5.69€";
        addToCarritoButton.addEventListener("click", function() {
          addToCart(name, 5.69)
        });
      } else if (data.result.properties.url.includes("planets")){ 
        priceContainer.textContent = "Precio: 3.25€";
        addToCarritoButton.addEventListener("click", function() {
          addToCart(name, 3.25)
        });
      } else if (data.result.properties.url.includes("starships")){ 
        priceContainer.textContent = "Precio: 8.50€";
        addToCarritoButton.addEventListener("click", function() {
          addToCart(name, 8.50)
        });
      } else { 
        priceContainer.textContent = "Precio: 6.75€";
        addToCarritoButton.addEventListener("click", function() {
          addToCart(name, 6.75)
        });
      }
      details.appendChild(priceContainer);
      details.appendChild(addToCarritoButton);

      detailsContainer.appendChild(details); // Agregar la lista de detalles al contenedor
    } catch (error) {
      console.error("Error al obtener los detalles:", error);
    }
  }

  // Función auxiliar para manejar la paginación con URLs específicas
  async function fetchAllWithUrl(url, resultContainer, endpoint) {
    if (!resultContainer) {
      console.error("El contenedor de resultados no existe.");
      return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      const next = data.next;
      const previous = data.previous;

      resultContainer.innerHTML = "";
      if (data.results && data.results.length > 0) {
        data.results.forEach((item) => {
          const div = document.createElement("div");
          div.classList.add("result-item");
          const link = document.createElement("button");
          link.textContent = item.name;
          link.addEventListener("click", function () {
            fetchDetails(endpoint, item.url); // Cambiar "people" según el endpoint dinámico
          });
          div.appendChild(link);
          resultContainer.appendChild(div);
        });

        // Actualización de los botones de paginación
        const paginationControls = document.createElement("div");
        paginationControls.classList.add("pagination-controls");

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Anterior";
        if (previous) {
          prevBtn.addEventListener("click", function () {
            fetchAllWithUrl(previous, resultContainer);
          });
        } else {
          prevBtn.disabled = true;
        }
        paginationControls.appendChild(prevBtn);

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Siguiente";
        if (next) {
          nextBtn.addEventListener("click", function () {
            fetchAllWithUrl(next, resultContainer);
          });
        } else {
          nextBtn.disabled = true;
        }
        paginationControls.appendChild(nextBtn);

        resultContainer.appendChild(paginationControls);
      } else {
        resultContainer.innerHTML = "No se encontraron resultados.";
      }
    } catch (error) {
      resultContainer.innerHTML =
        "Hubo un error al realizar la búsqueda. Intente nuevamente.";
    }
  }

  // Función para hacer fetch a la URL y guardar datos en un array
  async function fetchSaveArray(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      anArray = data.result;
      return anArray;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

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
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

      // Agregar personajes
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

  // Función para obtener la imagen correspondiente a un personaje
  function getImageByName(name) {
    //Mapeo cada url de imagen con su personaje
    const images = {
      "Luke Skywalker": "../assets/img/personajes/Luke.jpg",
      "C-3PO": "../assets/img/personajes/c3pO.jpg",
      "R2-D2": "../assets/img/personajes/r2-d2.jpg",
      "Darth Vader": "../assets/img/personajes/darth-vader.jpg",
      "Leia Organa": "../assets/img/personajes/leia-organa.jpg",
      "Owen Lars": "../assets/img/personajes/owen-lars.jpg",
      "Beru Whitesun lars": "../assets/img/personajes/beru-whitesun-lars.jpg",
      "R5-D4": "../assets/img/personajes/r5d4.jpg",
      "Biggs Darklighter": "../assets/img/personajes/biggs-darklighter.jpg",
      "Obi-Wan Kenobi": "../assets/img/personajes/obi-wan-kenobi.jpg",
      "Tion Medon": "../assets/img/personajes/tion-medon.jpg",
      "Sly Moore": "../assets/img/personajes/sly-moore.jpg",
      "Lama Su": "../assets/img/personajes/lama-su.jpg",
      "Taun We": "../assets/img/personajes/taun-we.jpg",
      "Jocasta Nu": "../assets/img/personajes/jocasta-nu.jpg",
      "R4-P17": "../assets/img/personajes/r4-p17.jpg",
      "Wat Tambor": "../assets/img/personajes/wat-tambor.jpg",
      "San Hill": "../assets/img/personajes/san-hill.jpg",
      "Shaak Ti": "../assets/img/personajes/shaak-ti.jpg",
      Grievous: "../assets/img/personajes/grievous.jpg",
      Tarfful: "../assets/img/personajes/tarfful.jpg",
      "Raymus Antilles": "../assets/img/personajes/raymus-antilles.jpg",
      "Cliegg Lars": "../assets/img/personajes/cliegg-lars.jpg",
      "Poggle the Lesser": "../assets/img/personajes/poggle-the-lesser.jpg",
      "Luminara Unduli": "../assets/img/personajes/luminara-unduli.jpg",
      "Barris Offee": "../assets/img/personajes/barriss-offee.jpg",
      Dormé: "../assets/img/personajes/dorme.jpg",
      Dooku: "../assets/img/personajes/dooku.jpg",
      "Bail Prestor Organa": "../assets/img/personajes/bail-prestor-organa.jpg",
      "Jango Fett": "../assets/img/personajes/jango-fett.jpg",
      "Zam Wesell": "../assets/img/personajes/zam-wesell.jpg",
      "Dexter Jettster": "../assets/img/personajes/dexter-jettster.jpg",
      "Ki-Adi-Mundi": "../assets/img/personajes/ki-adi-mundi.jpg",
      "Kit Fisto": "../assets/img/personajes/kit-fisto.jpg",
      "Eeth Koth": "../assets/img/personajes/eeth-koth.jpg",
      "Adi Gallia": "../assets/img/personajes/adi-gallia.jpg",
      "Saesee Tiin": "../assets/img/personajes/saesee-tiin.jpg",
      "Yarael Poof": "../assets/img/personajes/yarael-poof.jpg",
      "Plo Koon": "../assets/img/personajes/plo-koon.jpg",
      "Mas Amedda": "../assets/img/personajes/mas-amedda.jpg",
      "Gregar Typho": "../assets/img/personajes/gregar-typo.jpg",
      Cordé: "../assets/img/personajes/corde.jpg",
      "Quarsh Panaka": "../assets/img/personajes/quarsh-panaka.jpg",
      "Shmi Skywalker": "../assets/img/personajes/shmi-skywalker.jpg",
      "Darth Maul": "../assets/img/personajes/darth-maul.jpg",
      "Bib Fortuna": "../assets/img/personajes/bib-fortuna.jpg",
      "Ayla Secura": "../assets/img/personajes/ayla-secura.jpg",
      "Ratts Tyerel": "../assets/img/personajes/ratts-tyerel.jpg",
      "Dud Bolt": "../assets/img/personajes/dud-bolt.jpg",
      Gasgano: "../assets/img/personajes/gasgano.jpg",
      "Ben Quadinaros": "../assets/img/personajes/ben-quadinaros.jpg",
      "Mace Windu": "../assets/img/personajes/mace-windu.jpg",
      "Qui-Gon Jinn": "../assets/img/personajes/qui-gon-jinn.jpg",
      "Nute Gunray": "../assets/img/personajes/nute-gunray.jpg",
      "Finis Valorum": "../assets/img/personajes/finis-valorum.jpg",
      "Padmé Amidala": "../assets/img/personajes/padme-amidala.jpg",
      "Jar Jar Binks": "../assets/img/personajes/jar-jar-binks.jpg",
      "Roos Tarpals": "../assets/img/personajes/roos-tarpals.jpg",
      "Rugor Nass": "../assets/img/personajes/rugor-nass.jpg",
      "Ric Olié": "../assets/img/personajes/ric-olie.jpg",
      Watto: "../assets/img/personajes/watto.jpg",
      Sebulba: "../assets/img/personajes/sebulba.jpg",
      "Boba Fett": "../assets/img/personajes/boba-fett.jpg",
      "IG-88": "../assets/img/personajes/ig-88.jpg",
      Bossk: "../assets/img/personajes/bossk.jpg",
      "Lando Calrissian": "../assets/img/personajes/lando-calrissian.jpg",
      Lobot: "../assets/img/personajes/lobot.jpg",
      Ackbar: "../assets/img/personajes/ackbar.jpg",
      "Mon Mothma": "../assets/img/personajes/mon-mothma.jpg",
      "Arvel Crynyd": "../assets/img/personajes/arvel-crynyd.jpg",
      "Wicket Systri Warrick":
        "../assets/img/personajes/wicket-systri-warrick.jpg",
      "Nien Nunb": "../assets/img/personajes/nien-nunb.jpg",
      "Anakin Skywalker": "../assets/img/personajes/anakin-skywalker.jpg",
      "Wilhuff Tarkin": "../assets/img/personajes/wiluff-tarkin.jpg",
      Chewbacca: "../assets/img/personajes/chewbacca.jpg",
      "Han Solo": "../assets/img/personajes/han-solo.jpg",
      Greedo: "../assets/img/personajes/greedo.jpg",
      "Jabba Desilijic Tiure":
        "../assets/img/personajes/jabba-desilijic-tiure.jpg",
      "Wedge Antilles": "../assets/img/personajes/wedge-antilles.jpg",
      "Jek Tono Porkins": "../assets/img/personajes/jek-tono-porkins.jpg",
      Yoda: "../assets/img/personajes/yoda.jpg",
      Palpatine: "../assets/img/personajes/palpatine.jpg",
      Tatooine: "../assets/img/planetas/tatooine.jpg",
      Alderaan: "../assets/img/planetas/alderaan.jpg",
      "Yavin IV": "../assets/img/planetas/yavin-iv.jpg",
      Hoth: "../assets/img/planetas/hoth.jpg",
      Dagobah: "../assets/img/planetas/dagobah.jpg",
      Bespin: "../assets/img/planetas/bespin.jpg",
      Endor: "../assets/img/planetas/endor.jpg",
      Naboo: "../assets/img/planetas/naboo.jpg",
      Coruscant: "../assets/img/planetas/coruscant.jpg",
      Kamino: "../assets/img/planetas/kamino.jpg",
      Mirial: "../assets/img/planetas/mirial.jpg",
      Serenno: "../assets/img/planetas/serenno.jpg",
      "Concord Dawn": "../assets/img/planetas/concord-dawn.jpg",
      Zolan: "../assets/img/planetas/zolan.jpg",
      Ojom: "../assets/img/planetas/ojom.jpg",
      Skako: "../assets/img/planetas/skako.jpg",
      Muunilinst: "../assets/img/planetas/muunilinst.jpg",
      Shili: "../assets/img/planetas/shili.jpg",
      Kalee: "../assets/img/planetas/kalee.jpg",
      Umbara: "../assets/img/planetas/umbara.jpg",
      Tund: "../assets/img/planetas/tund.jpg",
      "Haruun Kal": "../assets/img/planetas/haruun-kal.jpg",
      Cerea: "../assets/img/planetas/cerea.jpg",
      "Glee Anselm": "../assets/img/planetas/glee-anselm.jpg",
      Iridonia: "../assets/img/planetas/iridonia.jpg",
      Tholoth: "../assets/img/planetas/tholoth.jpg",
      Iktotch: "../assets/img/planetas/iktotch.jpg",
      Quermia: "../assets/img/planetas/quermia.jpg",
      Dorin: "../assets/img/planetas/dorin.jpg",
      Champala: "../assets/img/planetas/champala.jpg",
      "Mon Cala": "../assets/img/planetas/mon-cala.jpg",
      Chandrila: "../assets/img/planetas/chandrila.jpg",
      Sullust: "../assets/img/planetas/sullust.jpg",
      Toydaria: "../assets/img/planetas/toydaria.jpg",
      Malastare: "../assets/img/planetas/malastare.jpg",
      Dathomir: "../assets/img/planetas/dathomir.jpg",
      Ryloth: "../assets/img/planetas/ryloth.jpg",
      "Aleen Minor": "../assets/img/planetas/aleen-minor.jpg",
      Vulpter: "../assets/img/planetas/vulpter.jpg",
      Troiken: "../assets/img/planetas/troiken.jpg",
      Eriadu: "../assets/img/planetas/Eriadu.jpg",
      Corellia: "../assets/img/planetas/corellia.jpg",
      Rodia: "../assets/img/planetas/rodia.jpg",
      "Nal Hutta": "../assets/img/planetas/nal-hutta.jpg",
      Dantooine: "../assets/img/planetas/dantooine.jpg",
      "Bestine IV": "../assets/img/planetas/bestine-iv.jpg",
      "Ord Mantell": "../assets/img/planetas/ord-mantell.jpg",
      Trandosha: "../assets/img/planetas/trandosha.jpg",
      Socorro: "../assets/img/planetas/socorro.jpg",
      Geonosis: "../assets/img/planetas/Geonosis.jpg",
      Utapau: "../assets/img/planetas/Utapau.jpg",
      Mustafar: "../assets/img/planetas/Mustafar.jpg",
      Kashyyyk: "../assets/img/planetas/kashyyyk.jpg",
      "Polis Massa": "../assets/img/planetas/polis-massa.jpg",
      Mygeeto: "../assets/img/planetas/mygeeto.jpg",
      Felucia: "../assets/img/planetas/Felucia.jpg",
      "Cato Neimoidia": "../assets/img/planetas/cato-neimoidia.jpg",
      Saleucami: "../assets/img/planetas/saleucami.jpg",
      Stewjon: "../assets/img/planetas/Stewjon.jpg",
      "CR90 corvette": "../assets/img/naves/cr90-corvette.jpg",
      "Star Destroyer": "../assets/img/naves/star-destroyer.jpg",
      "Sentinel-class landing craft":
        "../assets/img/naves/sentinel-class-landing-craft.jpg",
      "Death Star": "../assets/img/naves/death-star.jpg",
      "Y-wing": "../assets/img/naves/y-wing.jpg",
      "Millennium Falcon": "../assets/img/naves/millennium-falcon.jpg",
      "TIE Advanced x1": "../assets/img/naves/tie-advanced-1.jpg",
      Executor: "../assets/img/naves/executor.jpg",
      "X-wing": "../assets/img/naves/x-wing.jpg",
      "Rebel transport": "../assets/img/naves/rebel-transport.jpg",
      "V-wing": "../assets/img/naves/v-wing.jpg",
      "Belbullab-22 starfighter":
        "../assets/img/naves/belbullab-22-starfighter.jpg",
      "Banking clan frigte": "../assets/img/naves/banking-clan-frigate.jpg",
      "arc-170": "../assets/img/naves/arc-170.jpg",
      "Jedi Interceptor": "../assets/img/naves/jedi-interceptor.jpg",
      "Naboo star skiff": "../assets/img/naves/naboo-star-skiff.jpg",
      "J-type diplomatic barge":
        "../assets/img/naves/j-type-diplomatic-barge.jpg",
      Scimitar: "../assets/img/naves/scimitar.jpg",
      "AA-9 Coruscant freighter":
        "../assets/img/naves/aa-9-coruscant-freighter.jpg",
      "Jedi starfighter": "../assets/img/naves/jedi-starfighter.jpg",
      "Republic Assault ship": "../assets/img/naves/republic-assault-ship.jpg",
      "H-type Nubian yacht": "../assets/img/naves/h-type-nubian-yacht.jpg",
      "Trade Federation cruiser":
        "../assets/img/naves/trade-federation-cruiser.jpg",
      "Solar Sailer": "../assets/img/naves/solar-sailer.jpg",
      "Theta-class T-2c shuttle":
        "../assets/img/naves/theta-class-t-2c-shuttle.jpg",
      "Republic attack cruiser":
        "../assets/img/naves/republic-attack-cruiser.jpg",
      "Slave 1": "../assets/img/naves/slave-1.jpg",
      "Imperial shuttle": "../assets/img/naves/imperial-shuttle.jpg",
      "EF76 Nebulon-B escort frigate": "../assets/img/naves/ef76-nebulon-b.jpg",
      "A-wing": "../assets/img/naves/a-wing.jpg",
      "Calamari Cruiser": "../assets/img/naves/calamari-cruiser.jpg",
      "B-wing": "../assets/img/naves/b-wing.jpg",
      "Republic Cruiser": "../assets/img/naves/republic-cruiser.jpg",
      "Droid control ship": "../assets/img/naves/droid-control-ship.jpg",
      "Naboo fighter": "../assets/img/naves/naboo-fighter.jpg",
      "Naboo Royal Starship": "../assets/img/naves/naboo-royal-starship.jpg",
      "Tsmeu-6 personal wheel bike":
        "../assets/img/vehicles/tsmeu-6-personal-wheel-bike.jpg",
      "Emergency Firespeeder":
        "../assets/img/vehicles/emergency-firespeeder.jpg",
      "Oevvaor jet catamaran":
        "../assets/img/vehicles/oevvaor-jet-catamaran.jpg",
      "Raddaugh Gnasp fluttercraft":
        "../assets/img/vehicles/raddaugh-gnasp-fluttercraft.jpg",
      "Droid tri-fighter": "../assets/img/vehicles/droid-tri-fighter.jpg",
      "Clone turbo tank": "../assets/img/vehicles/clone-turbo-tank.jpg",
      "Corporate Alliance tank droid":
        "../assets/img/vehicles/corporate-alliance-tank-droid.jpg",
      "Droid gunship": "../assets/img/vehicles/droid-gunship.jpg",
      "AT-RT": "../assets/img/vehicles/at-rt.jpg",
      "Zephyr-G swoop bike": "../assets/img/vehicles/zephyr-g-swoop-bike.jpg",
      "Koro-2 Exodrive airspeed":
        "../assets/img/vehicles/koro2-exodrive-airspeeder.jpg",
      "XJ-6 airspeeder": "../assets/img/vehicles/xj-6-airspeeder.jpg",
      "LAAT/i": "../assets/img/vehicles/laat-i.jpg",
      "LAAT/c": "../assets/img/vehicles/laat-c.jpg",
      "AT-TE": "../assets/img/vehicles/at-te.jpg",
      SPHA: "../assets/img/vehicles/spha.jpg",
      "Flitknot speeder": "../assets/img/vehicles/flitknot-speeder.jpg",
      "Neimoidian shuttle": "../assets/img/vehicles/neimoidian-shuttle.jpg",
      "Geonosian starfighter":
        "../assets/img/vehicles/geonosian-starfighter.jpg",
      "Bantha-II cargo skiff":
        "../assets/img/vehicles/bantha-ii-cargo-skiff.jpg",
      "Imperial Speeder Bike":
        "../assets/img/vehicles/imperial-speeder-bike.jpg",
      "TIE/IN interceptor": "../assets/img/vehicles/tie-in-interceptor.jpg",
      "Vulture Droid": "../assets/img/vehicles/vulture-droid.jpg",
      "Multi-Troop Transport":
        "../assets/img/vehicles/multi-troop-transport.jpg",
      "Armored Assault tank": "../assets/img/vehicles/armored-assault-tank.jpg",
      "Single Trooper Aerial Platform":
        "../assets/img/vehicles/signle-trooper-aerial-platform.jpg",
      "C-9979 landing craft": "../assets/img/vehicles/c-9979-landing-craft.jpg",
      "Tribubble bongo": "../assets/img/vehicles/tribubble-bongo.jpg",
      "Sith speeder": "../assets/img/vehicles/sith-speeder.jpg",
      "Sand Crawler": "../assets/img/vehicles/sand-crawler.jpg",
      "X-34 landspeeder": "../assets/img/vehicles/x-34-landspeeder.jpg",
      "T-16 skyhopper": "../assets/img/vehicles/t-16-skyhopper.jpg",
      "TIE/LN starfighter": "../assets/img/vehicles/tie-ln-starfighter.jpg",
      Snowspeeder: "../assets/img/vehicles/snowspeeder.jpg",
      "AT-AT": "../assets/img/vehicles/at-at.jpg",
      "TIE bomber": "../assets/img/vehicles/tie-bomber.jpg",
      "AT-ST": "../assets/img/vehicles/at-st.jpg",
      "Storm IV Twin-Pod cloud car":
        "../assets/img/vehicles/storm-iv-twin-pod-cloud-car.jpg",
      "Sail barge": "../assets/img/vehicles/sail-barge.jpg",
      "A New Hope": "../assets/img/peliculas/a-new-hope.jpg",
      "The Empire Strikes Back":
        "../assets/img/peliculas/the-empire-strikes-back.jpg",
      "Return of the Jedi": "../assets/img/peliculas/return-of-the-jedi.jpg",
      "The Phantom Menace": "../assets/img/peliculas/the-phantom-menace.jpg",
      "Attack of the Clones":
        "../assets/img/peliculas/attack-of-the-clones.jpg",
      "Revenge of the Sith": "../assets/img/peliculas/revenge-of-the-sith.jpg",
    };

    // Devuelve la URL de la imagen correspondiente, o una imagen predeterminada si no se encuentra
    return images[name] || "../assets/img/fondo.jpg";
  }
});









// Obtener el carrito desde localStorage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Guardar el carrito en localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar un producto al carrito
function addToCart(productName, productPrice) {
  const cart = getCart();
  const existingProduct = cart.find(item => item.name === productName);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: 1 });
  }

  saveCart(cart);
  alert(`${productName} agregado al carrito!`);
}

// Mostrar el carrito
function displayCart() {
  const cart = getCart();
  const cartItemsElement = document.getElementById('cart-items');
  if (!cartItemsElement) return;

  cartItemsElement.innerHTML = '';

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Eliminar';
    removeButton.onclick = () => removeFromCart(item.name);
    li.appendChild(removeButton);
    cartItemsElement.appendChild(li);
  });
}

// Eliminar un producto del carrito
function removeFromCart(productName) {
  let cart = getCart();
  cart = cart.filter(item => item.name !== productName);
  saveCart(cart);
  displayCart();
}

// Vaciar el carrito
function clearCart() {
  localStorage.removeItem('cart');
  displayCart();
}

// Inicializar la visualización del carrito
document.addEventListener('DOMContentLoaded', displayCart);

// Exponer funciones al objeto global
window.addToCart = addToCart;
window.clearCart = clearCart;
window.removeFromCart = removeFromCart;