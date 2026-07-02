console.log("player.js chargé");
const playlist = [
  "music/Lunar Silver Star Story Complete (Intro) - PSX.mp3"
];

const audio = document.querySelector("#ga-audio");
console.log("audio :", audio);
console.log("playBtn :", document.querySelector("#ga-play"));
const playBtn = document.querySelector("#ga-play");
const nextBtn = document.querySelector("#ga-next");
const title = document.querySelector("#ga-track-title");
const volume = document.querySelector("#ga-volume");
let index = 0;

function loadTrack(i) {
  if (!audio || playlist.length === 0) return;
  index = (i + playlist.length) % playlist.length;
  audio.src = playlist[index];
  title.textContent = playlist[index].split("/").pop();
}

function updatePlayLabel() {
  if (!playBtn || !audio) return;
  playBtn.textContent = audio.paused ? "Play" : "Pause";
}

if (audio && playBtn && nextBtn && volume) {
  audio.volume = Number(localStorage.getItem("ga-volume") || volume.value || 0.45);
  volume.value = audio.volume;

  if (playlist.length) loadTrack(0);

  playBtn.addEventListener("click", async () => {
    if (!playlist.length) {
      title.textContent = "Ajoute une musique dans js/player.js";
      return;
    }
    if (audio.paused) await audio.play();
    else audio.pause();
    updatePlayLabel();
  });

  nextBtn.addEventListener("click", async () => {
    if (!playlist.length) return;
    loadTrack(index + 1);
    await audio.play();
    updatePlayLabel();
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    localStorage.setItem("ga-volume", String(audio.volume));
  });

  audio.addEventListener("ended", () => {
    if (!playlist.length) return;
    loadTrack(index + 1);
    audio.play();
  });

  audio.addEventListener("play", updatePlayLabel);
  audio.addEventListener("pause", updatePlayLabel);
}
