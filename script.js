// ===== ЧАСЫ =====
function updateClock() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  document.getElementById("clock").textContent = `${hours}:${minutes}`;

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  const formattedDate = now.toLocaleDateString("en-us", options);
  document.getElementById("date").textContent = formattedDate;
}

setInterval(updateClock, 1000);
updateClock();


// ===== ПОГОДА (пример: Екатеринбург) =====
async function getWeather() {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=56.83&longitude=60.60&current_weather=true"
  );
  const data = await res.json();
  document.getElementById("weather").textContent =
    data.current_weather.temperature + "°C";
}
getWeather();


// ===== ПЛЕЕР =====
const tracks = [
  { title: "you have found the mythical seal cave", artist: "AZALI", src: "tracks/track1.mp3" },
  { title: "Rainless (Hum)", artist: "Sohaoying", src: "tracks/track2.mp3" },
  { title: "Cruising", artist: "Sohaoying", src: "tracks/track3.mp3" },
  { title: "Cold Streets", artist: "Pixel Beats", src: "tracks/track4.mp3" },
  { title: "Sunset Logistics", artist: "Sohaoying", src: "tracks/track5.mp3" },
  { title: "Cold Streets", artist: "Pixel Beats", src: "tracks/track6.mp3" },
  { title: "Cold Streets", artist: "Pixel Beats", src: "tracks/track7.mp3" },
  { title: "Cold Streets", artist: "Pixel Beats", src: "tracks/track8.mp3" },
  { title: "Cold Streets", artist: "Pixel Beats", src: "tracks/track9.mp3" },
  { title: "Cold Streets", artist: "Pixel Beats", src: "tracks/track10.mp3" },
  { title: "Cold Streets", artist: "Pixel Beats", src: "tracks/track2.mp3" },
];

let currentTrack = 0;
const audio = new Audio(tracks[currentTrack].src);

const titleEl = document.getElementById("track-title");
const artistEl = document.getElementById("track-artist");
const playBtn = document.getElementById("playBtn");

function loadTrack(i) {
  audio.src = tracks[i].src;
  titleEl.textContent = tracks[i].title;
  artistEl.textContent = tracks[i].artist;
}
loadTrack(currentTrack);

audio.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
});

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

const skipBtn = document.getElementById("skipBtn");

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
  audio.play();
  playBtn.textContent = "⏸";
}

skipBtn.addEventListener("click", nextTrack);

// ===== ПЕРЕТАСКИВАНИЕ ВИДЖЕТОВ =====
document.querySelectorAll(".widget").forEach(widget => {

  let isDragging = false;
  let isResizing = false;
  let offsetX, offsetY;
  let startX;
  let startScale = 1;
  let currentScale = 1;

  const handle = widget.querySelector(".resize-handle");

  // ===== POINTER DOWN =====
  widget.addEventListener("pointerdown", e => {

    if (e.target === handle) {
      isResizing = true;
      startX = e.clientX;
      startScale = currentScale;
    } else {
      isDragging = true;
      offsetX = e.clientX - widget.offsetLeft;
      offsetY = e.clientY - widget.offsetTop;
    }

    widget.setPointerCapture(e.pointerId);
  });

  // ===== POINTER MOVE =====
  widget.addEventListener("pointermove", e => {

    if (isDragging) {
      widget.style.left = (e.clientX - offsetX) + "px";
      widget.style.top = (e.clientY - offsetY) + "px";
    }

    if (isResizing) {
      let delta = e.clientX - startX;
      currentScale = startScale + delta / 200;
      currentScale = Math.min(Math.max(0.5, currentScale), 3);
      widget.style.transform = `scale(${currentScale})`;
    }

  });

  // ===== POINTER UP =====
  widget.addEventListener("pointerup", () => {
    isDragging = false;
    isResizing = false;
  });

});