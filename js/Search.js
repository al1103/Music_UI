import { getToken } from "./AuthAPI.js";
const mainContent = document.getElementsByClassName("main__content__list")[0];

const searchInput = document.getElementById("search");

const useDebounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const showLoadingIndicator = () => {
  return `
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`;
};

const searchAlbums = async (name, token, renderResults) => {
  try {
    if (!name) {
      return;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${name}&type=album`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch albums");
    }

    const data = await response.json();
    renderResults(data.albums.items);
  } catch (error) {
    console.error("Error in searchAlbums:", error.message);
    // Handle the error if needed
  }
};

const renderResults = (items) => {
  mainContent.innerHTML = "";
  if (!items) {
    return;
  } else {
    if (!items.length) {
      mainContent.insertAdjacentHTML(
        "beforeend",
        `<p class="main__content__list__item__text">No results found</p>`
      );
      return;
    }
    items.forEach((item) => {
      const html = `<a href="../Playlist/index.html?id=${item.id}" class="main__a">
        <div class="main__content__list__item">
          <div class="main__content__list__item__img">
            <img
              src=${item.images[1].url}
              alt=""
            />
          </div>
          <p class="main__content__list__item__text">${item.name}</p>
        </div>
      </a>`;
      mainContent.insertAdjacentHTML("beforeend", html);
    });
  }
};

const debouncedSearchAlbums = useDebounce((name, token) => {
  searchAlbums(name, token, renderResults);
}, 500);

searchInput.addEventListener("input", async () => {
  try {
    const token = await getToken();
    const name = searchInput.value; // Get the current value of the input

    // Only perform search if the input is not empty
    debouncedSearchAlbums(name, token);
  } catch (error) {
    console.error("Error in main:", error.message);
  }
});

async function main() {
  try {
    const token = await getToken();
    const name = searchInput.value;

    // Only perform search if the input is not empty
    if (name) {
      searchAlbums(name, token, renderResults);
    }
  } catch (error) {
    console.error("Error in main:", error.message);
  }
}

main();
