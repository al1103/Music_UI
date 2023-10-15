const muteIcon = document.getElementById('volume-mute');
const volumeIcon = document.getElementById('volume--icon');
const volume = document.getElementById('volume');
const sound = document.getElementById('sound');
muteIcon.style.display = 'none';
volumeIcon.style.display = 'block';


const toggleMuteVolumeIcon = () => {
  if (muteIcon.style.display === 'none') {
    muteIcon.style.display = 'block';
    volumeIcon.style.display = 'none';
    audio.volume = 0;
  } else {
    muteIcon.style.display = 'none';
    volumeIcon.style.display = 'block';
    audio.volume = 1;
  }
  
};

const handleSound = (e)=>{
  const value = e.target.value;
  audio.volume = value / 100;
}

volume.addEventListener('click', toggleMuteVolumeIcon);
sound.addEventListener('input',handleSound);
