/*
  Lecteur musical persistant — base prête à brancher.
  Ajoute tes fichiers dans /music puis complète la playlist.
*/
const GA_PLAYLIST = [
  // "music/theme.mp3"
];

const audio = document.querySelector("#ga-audio");
const playButton = document.querySelector("#ga-play");
const nextButton = document.querySelector("#ga-next");
const volumeInput = document.querySelector("#ga-volume");
const trackLabel = document.querySelector("#ga-track-title");

let currentTrack = 0;

function updateTrackLabel() {
  if (!trackLabel) return;
  trackLabel.textContent = GA_PLAYLIST[currentTrack] || "Aucune musique";
}

function loadTrack(index) {
  if (!audio || !GA_PLAYLIST.length) return;
  currentTrack = (index + GA_PLAYLIST.length) % GA_PLAYLIST.length;
  audio.src = GA_PLAYLIST[currentTrack];
  updateTrackLabel();
}

function togglePlay() {
  if (!audio || !GA_PLAYLIST.length) return;

  if (!audio.src) loadTrack(currentTrack);

  if (audio.paused) {
    audio.play().catch(() => {
      console.warn("Le navigateur bloque la lecture automatique tant que l'utilisateur n'a pas interagi.");
    });
    if (playButton) playButton.textContent = "Pause";
  } else {
    audio.pause();
    if (playButton) playButton.textContent = "Play";
  }
}

function nextTrack() {
  if (!GA_PLAYLIST.length) return;
  loadTrack(currentTrack + 1);
  audio.play();
}

if (playButton) playButton.addEventListener("click", togglePlay);
if (nextButton) nextButton.addEventListener("click", nextTrack);

if (volumeInput && audio) {
  audio.volume = Number(volumeInput.value || 0.45);
  volumeInput.addEventListener("input", () => {
    audio.volume = Number(volumeInput.value);
  });
}

if (audio) {
  audio.addEventListener("ended", nextTrack);
}

updateTrackLabel();