const clientId = "913c581b4cb242a582af2b12576947ea";
const clientSecret = "fc02db3efab84817b3d266190015370a";

const playlist = document.getElementById("playlist");
const headerContent = document.getElementById("div");
const IconPlay = document.getElementById("play--icon");
const IconPause = document.getElementById("pause--icon");
const nextSong = document.getElementById("next");
const previousSong = document.getElementById("prev");
const untidy = document.getElementById("untidy");
const loop = document.getElementById("loop");
const currentTimeDisplay = document.getElementById("currentTime");
const durationTimeDisplay = document.getElementById("durationTime");
const seekSlider = document.getElementById("seekSlider");
const nameSongPlay = document.querySelector(".control__play__inner__left__text");
const musicSong = document.getElementById("audio");

headerContent.innerHTML = "";
const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");

const getToken = async () => {
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
};

const getPlaylist = async (albumId, token) => {
  const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + token },
  });

  return await result.json();
};

const getPlaylistData = async () => {
  const token = await getToken();
  return await getPlaylist(albumId, token).then((result) => result.tracks.items);
};

const setNameSong = (url, duration, name, artist) => {
  nameSongPlay.innerHTML = `
    <div class="control__play__inner__left__text__name">${name}</div>
    <div class="control__play__inner__left__text__artist"><p>${artist}</p></div>`;
  musicSong.setAttribute("src", url);
  durationTimeDisplay.innerHTML = formatDuration(duration);
  musicSong.pause();
};

const togglePlaySong = () => {
  if (musicSong.paused) {
    musicSong.play();
    IconPause.style.display = "block";
    IconPlay.style.display = "none";
  } else {
    musicSong.pause();
    IconPause.style.display = "none";
    IconPlay.style.display = "block";
  }
};

const handlePostLinkPlay = (url, duration, index, name, artists) => {
  setNameSong(url, duration, name, artists);
  togglePlaySong();
  checkIndex(index);
};

let currentSongIndex;

const checkIndex = (id) => {
  currentSongIndex = id;
};

const updateSong = async () => {
  const playlistData = await getPlaylistData();
  handlePostLinkPlay(
    playlistData[currentSongIndex].preview_url,
    playlistData[currentSongIndex].duration_ms,
    currentSongIndex,
    playlistData[currentSongIndex].name,
    playlistData[currentSongIndex].artists[0].name
  );
};

nextSong.addEventListener("click", async () => {
  const playlistData = await getPlaylistData();
  currentSongIndex = (currentSongIndex + 1) % playlistData.length;
  updateSong();
});

previousSong.addEventListener("click", async () => {
  const playlistData = await getPlaylistData();
  currentSongIndex = (currentSongIndex - 1 + playlistData.length) % playlistData.length;
  updateSong();
});

untidy.addEventListener("click", async () => {
  const playlistData = await getPlaylistData();
  currentSongIndex = Math.floor(Math.random() * playlistData.length);
  updateSong();
});

loop.addEventListener("click", () => {
  musicSong.loop = !musicSong.loop;
  updateSong();
});

const main = async () => {
  const token = await getToken();

  try {
    const playlistData = await getPlaylist(albumId, token);
    playlist.innerHTML = "";

    playlistData.tracks.items.forEach((track, index) => {
      const html = `
        <div class="playlist" onclick="handlePostLinkPlay('${
          track.preview_url
        }','${track.duration_ms}','${index}','${track.name}','${
        track.artists[0].name
      }')">
          <div class="div-5">
            <div class="text-wrapper-5">${index + 1}</div>
            <div class="div-6">
              <img class="image" src="https://placehold.co/600x400" />
              <div class="div-7"> 
                <div class="link-wrapper"><div class="link">${track.name}</div></div>
                <div class="link-wrapper"><div class="link-2">${track.artists[0].name}</div></div>
              </div>
            </div>
          </div>
          <div class="div-8">
            <div class="album"><div class="link-2">${track.name}</div></div>
            <div class="text-wrapper-6">${formatDuration(track.duration_ms)}</div>
          </div>
        </div>
      `;
      playlist.innerHTML += html;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  try {
    const playlistData = await getPlaylist(albumId, token);
    headerContent.innerHTML = `
      <img class="img-2" src=${playlistData.images[0].url} />
      <div class="div-2">
        <div class="div-3">
          <div class="text-wrapper">${playlistData.type}</div>
          <div class="text-wrapper-2">${playlistData.name}</div>
          <p class="p">${playlistData.id}</p>
        </div>
        <div class="div-4">
          <img class="img" src="https://placehold.co/25x25" />
          <div class="text-wrapper-3">・</div>
          <div class="text-wrapper"> likes</div>
          <div class="text-wrapper-3">・</div>
          <div class="text-wrapper">${playlistData.tracks.total} songs,</div>
          <div class="text-wrapper-4">about 10 hr</div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
};

const formatDuration = (durationInMilliseconds) => {
  const minutes = Math.floor(durationInMilliseconds / 60000);
  const seconds = ((durationInMilliseconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

main();

const playButton = document.getElementById("play");
playButton.addEventListener("click", togglePlaySong);

seekSlider.addEventListener("input", function () {
  musicSong.currentTime = seekSlider.value;
  currentTimeDisplay.innerHTML = formatDuration(seekSlider.value);
});

musicSong.addEventListener("timeupdate", function (e) {
  seekSlider.value = e.target.currentTime;
  currentTimeDisplay.innerHTML = formatDuration(e.target.currentTime);
});

musicSong.addEventListener("loadedmetadata", function () {
  seekSlider.max = musicSong.duration;
});
