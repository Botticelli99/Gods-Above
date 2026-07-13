(function() {
  // ==== PLAYLIST : modifie / complète ce tableau ====
  var gaPlaylist = [
    {
      src: "music/lunar-intro.mp3",
      titre: "Lunar Silver Star Story",
      artiste: "PSX",
      cover: ""
    }
  ];

  var idx = 0;
  var audio = document.getElementById('gaAudio');
  var playBtn = document.getElementById('gaPlay');
  var playIcon = document.getElementById('gaPlayIcon');
  var progress = document.getElementById('gaProgress');
  var current = document.getElementById('gaCurrent');
  var duration = document.getElementById('gaDuration');
  var titleEl = document.getElementById('gaTitle');
  var artistEl = document.getElementById('gaArtist');
  var coverEl = document.getElementById('gaCover');
  var indexEl = document.getElementById('gaIndex');
  var volume = document.getElementById('gaVolume');

  if (!audio || !playBtn || !progress || !volume) return;

  var ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
  var ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

  function formatTime(t) {
    if (isNaN(t)) return "0:00";
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function loadTrack(i) {
    var track = gaPlaylist[i];
    audio.src = track.src;
    titleEl.textContent = track.titre;
    artistEl.textContent = track.artiste;
    if (track.cover) {
      coverEl.style.backgroundImage = "url('" + track.cover + "')";
      coverEl.textContent = "";
    } else {
      coverEl.style.backgroundImage = "none";
      coverEl.textContent = "Aurellon";
    }
    indexEl.textContent = (i + 1) + " / " + gaPlaylist.length;
  }

  async function playTrack() {
    try {
      await audio.play();
      playIcon.innerHTML = ICON_PAUSE;
    } catch (error) {
      console.error("Lecture audio impossible :", error);
    }
  }
  function pauseTrack() {
    audio.pause();
    playIcon.innerHTML = ICON_PLAY;
  }

  playBtn.addEventListener('click', function() {
    if (audio.paused) playTrack(); else pauseTrack();
  });

  var player = document.getElementById('gaPlayer');
  var toggle = document.getElementById('gaToggle');

  if (localStorage.getItem('ga-player-collapsed') === 'true') {
    player.classList.add('is-collapsed');
  }

  toggle.addEventListener('click', function() {
    var collapsed = player.classList.toggle('is-collapsed');
    localStorage.setItem('ga-player-collapsed', String(collapsed));
  });

  document.getElementById('gaNext').addEventListener('click', function() {
    idx = (idx + 1) % gaPlaylist.length;
    loadTrack(idx);
    playTrack();
  });
  document.getElementById('gaPrev').addEventListener('click', function() {
    idx = (idx - 1 + gaPlaylist.length) % gaPlaylist.length;
    loadTrack(idx);
    playTrack();
  });

  audio.addEventListener('timeupdate', function() {
    if (audio.duration) {
      progress.value = (audio.currentTime / audio.duration) * 100;
      current.textContent = formatTime(audio.currentTime);
    }
  });
  audio.addEventListener('loadedmetadata', function() {
    duration.textContent = formatTime(audio.duration);
  });
  audio.addEventListener('ended', function() {
    idx = (idx + 1) % gaPlaylist.length;
    loadTrack(idx);
    playTrack();
  });

  progress.addEventListener('input', function() {
    if (audio.duration) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
  });

  var savedVolume = localStorage.getItem('ga-player-volume');
  if (savedVolume !== null) {
    volume.value = savedVolume;
  }

  volume.addEventListener('input', function() {
    audio.volume = Number(volume.value);
    localStorage.setItem('ga-player-volume', String(audio.volume));
  });

  audio.volume = Number(volume.value);

  loadTrack(idx);
})();
