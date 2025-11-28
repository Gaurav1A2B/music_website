const songListEl = document.getElementById("songList");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");

// Hero & player info elements
const currentTitleEl = document.getElementById("currentTitle");
const currentArtistEl = document.getElementById("currentArtist");
const currentCoverEl = document.getElementById("currentCover");

const playerTitleEl = document.getElementById("playerTitle");
const playerArtistEl = document.getElementById("playerArtist");
const playerCoverEl = document.getElementById("playerCover");

let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();

// Render song list
function renderSongs() {
  songListEl.innerHTML = "";
  songs.forEach((song, index) => {
    const row = document.createElement("div");
    row.className =
      "song-row flex items-center justify-between px-3 py-2 text-sm";

    row.dataset.index = index;

    row.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-8 text-zinc-400 text-xs">${index + 1}</div>
        <img src="${song.cover}" alt="${song.title}" class="w-10 h-10 rounded object-cover" />
        <div>
          <div class="font-medium">${song.title}</div>
          <div class="text-xs text-zinc-400">${song.artist}</div>
        </div>
      </div>
      <div class="text-xs text-zinc-400">${song.duration}</div>
    `;

    row.addEventListener("click", () => {
      if (index === currentIndex && isPlaying) {
        pauseSong();
      } else {
        loadSong(index);
        playSong();
      }
    });

    songListEl.appendChild(row);
  });

  highlightActiveSong();
}

// Load song info into player
function loadSong(index) {
  currentIndex = index;
  const song = songs[currentIndex];

  audio.src = song.src;

  // Top hero section
  currentTitleEl.textContent = song.title;
  currentArtistEl.textContent = song.artist;
  currentCoverEl.src = song.cover;

  // Bottom player
  playerTitleEl.textContent = song.title;
  playerArtistEl.textContent = song.artist;
  playerCoverEl.src = song.cover;

  highlightActiveSong();
}

// Highlight active row
function highlightActiveSong() {
  const rows = document.querySelectorAll(".song-row");
  rows.forEach((row, idx) => {
    row.classList.toggle("active", idx === currentIndex);
  });
}

// Play / Pause controls
function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶";
}

// Next / Previous
function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

// Format seconds to M:SS
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Update progress bar
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);

  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent || 0}%`;
});

// Seek when clicking progress bar
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

// Auto-next when song ends
audio.addEventListener("ended", nextSong);

// Button events
playPauseBtn.addEventListener("click", () => {
  if (!audio.src) {
    loadSong(currentIndex);
  }
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Initial setup
renderSongs();
loadSong(currentIndex);
pauseSong(); // start in paused state
