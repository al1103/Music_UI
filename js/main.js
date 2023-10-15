const clientId = "913c581b4cb242a582af2b12576947ea";
const clientSecret = "fc02db3efab84817b3d266190015370a";

const YourTopMixes = document.getElementById("Your-top-mixes");

// private method to get token
const showLoadingIndicator = () => {
  return `
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`;
};

const _getToken = async () => {
  try {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error; // rethrow the error to propagate it
  }
};

const getCategories = async (offset, limit = 6) => {
  const token = await _getToken();
  try {
    const result = await fetch(
      `https://api.spotify.com/v1/browse/new-releases?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const getPlaylistTracks = async (id) => {
  const token = await _getToken();
  try {
    const result = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.tracks.items;
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    throw error;
  }
};

const main = async () => {
  try {
    YourTopMixes.innerHTML = showLoadingIndicator();

    const TopMixes = await getCategories(6);
    const trending = TopMixes.albums.items
      .map(
        (track) => `
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
        </div>
      `
      )
      .join("");

    YourTopMixes.innerHTML = trending;

    const html = await getCategories(0);
    document.getElementById("top-tracks").innerHTML = html.albums.items
      .map(
        (track) => `
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
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Main function error:", error);
  }
};

main();
