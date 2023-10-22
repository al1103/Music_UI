import { getToken } from "./AuthAPI.js";

const YourTopMixes = document.getElementById("Your-top-mixes");
console.log(window.location.pathname)
const showLoadingIndicator = () => {
  return `
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`;
};

const fetchSpotifyData = async (url) => {
  const token = await getToken();
  try {
    const result = await fetch(url, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

const renderTrack = (track) => {
  return `
    <div class="play">
      <a href="../page/Playlist/index.html?id=${track.id}">
        <img class="rectangle" src="${track.images[0].url}" />
        <div class="div-5">
          <div class="text-wrapper-4">${track.name}</div>
          <p class="p">${track.artists[0].name}</p>
        </div>
        <div class="iconplay">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
            <path d="M0.989258 17.5151V0.484863L16.016 9L0.989258 17.5151Z" fill="black" />
          </svg>
        </div>
      </a>
    </div>`;
};

const renderTracks = (container, tracks) => {
  container.innerHTML = tracks.map(renderTrack).join("");
};

const main = async () => {
  try {
    YourTopMixes.innerHTML = showLoadingIndicator();

    const topMixesData = await fetchSpotifyData("https://api.spotify.com/v1/browse/new-releases?offset=6&limit=6");
    const trendingTracks = topMixesData.albums.items;
    renderTracks(YourTopMixes, trendingTracks);

    const topTracksData = await fetchSpotifyData("https://api.spotify.com/v1/browse/new-releases?offset=0&limit=6");
    const topTracks = topTracksData.albums.items;
    renderTracks(document.getElementById("top-tracks"), topTracks);
  } catch (error) {
    console.error("Main function error:", error);
  }
};

main();
