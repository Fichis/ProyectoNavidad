import { images } from "./db.js";

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
      addToCarritoButton.textContent = "Añadir al carrito";
      /* console.log(data.result.properties.url); */
      if (data.result.properties.url.includes("people")) {
        priceContainer.textContent = "Precio: 5.69€";
        addToCarritoButton.addEventListener("click", function () {
          addToCart(name, 5.69);
        });
      } else if (data.result.properties.url.includes("planets")) {
        priceContainer.textContent = "Precio: 3.25€";
        addToCarritoButton.addEventListener("click", function () {
          addToCart(name, 3.25);
        });
      } else if (data.result.properties.url.includes("starships")) {
        priceContainer.textContent = "Precio: 8.50€";
        addToCarritoButton.addEventListener("click", function () {
          addToCart(name, 8.5);
        });
      } else {
        priceContainer.textContent = "Precio: 6.75€";
        addToCarritoButton.addEventListener("click", function () {
          addToCart(name, 6.75);
        });
      }
      details.appendChild(priceContainer);
      details.appendChild(addToCarritoButton);

      detailsContainer.appendChild(details); // Agregar la lista de detalles al contenedor
    } catch (error) {
      console.error("Error al obtener los detalles:", error);
    }
  }

  // Función para obtener la imagen correspondiente a un personaje
  function getImageByName(name) {
    // Devuelve la URL de la imagen correspondiente del array importado, o una imagen predeterminada si no se encuentra
    return images[name] || "./assets/img/fondo.jpg";
  }

  // Función para hacer fetch a la URL y guardar datos en un array
  async function fetchSaveArray(url) {
    try {
      let anArray = [];
      const response = await fetch(url);
      const data = await response.json();
      anArray = data.result;
      /* console.log(anArray); */
      return anArray;
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

export { fetchData, fetchAll, getImageByName, fetchSaveArray };
