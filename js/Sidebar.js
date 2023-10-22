import { getToken } from "./AuthAPI.js";

const getYourPlaylist = async () => {
  const data = await fetch("https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + (await getToken()),
    },
  })
  const res = await data.json()
  return res
  
  ;
};



const yourMusic = document.getElementById('your-music')
yourMusic.innerHTML = "";
getYourPlaylist().then((res) => {

  res.items.forEach((item) => {
    yourMusic.innerHTML += `
    <li >
    <a href="../page/Playlist/index.html?id=${item.track.id}" class="items">
      <div class="items-img">
        <img
          src="${
              item.track.album.images[0].url
          }
        "
          alt=""
        />
      </div>
      <div class="items-text">
        <div class="items-name">${item.track.album.name}</div>
        <div class="items-artist">
          <span> ${item.track.artists[0].name}- ${item.track.album.type} </span>
        </div>
      </div>
    </a>
    </li>
    `
  });
})