// ===== ЧАСЫ =====
function updateClock() {
  var now = new Date();

  var hours = now.getHours();
  var minutes = now.getMinutes();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  var timeString = hours + ":" + minutes;

  var day = now.getDate();
  var month = now.getMonth() + 1;
  var year = now.getFullYear();

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  var dateString = day + "." + month + "." + year;

  var clockEl = document.getElementById("clock");
  var dateEl = document.getElementById("date");

  if (clockEl) clockEl.innerHTML = timeString;
  if (dateEl) dateEl.innerHTML = dateString;
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
// ===== ТРЕКИ =====
document.addEventListener("DOMContentLoaded", function () {

  var tracks = [
    { title: "Track 1", artist: "Artist 1", src: "tracks/track1.mp3" },
    { title: "Track ", artist: "Artist 2", src: "tracks/track2.mp3" }
  ];

  var audio = new Audio();
  var currentTrack = 0;
  var isPlaying = false;

  var titleEl = document.getElementById("track-title");
  var artistEl = document.getElementById("track-artist");
  var playBtn = document.getElementById("playBtn");
  var skipBtn = document.getElementById("skipBtn");

  function loadTrack(index) {
    audio.src = tracks[index].src;
    titleEl.innerHTML = tracks[index].title;
    artistEl.innerHTML = tracks[index].artist;
  }

  function togglePlay(e) {
    e.stopPropagation();

    if (isPlaying) {
      audio.pause();
      playBtn.innerHTML = "▶";
      isPlaying = false;
    } else {
      audio.play();
      playBtn.innerHTML = "⏸";
      isPlaying = true;
    }
  }

  function nextTrack(e) {
    e.stopPropagation();

    currentTrack++;
    if (currentTrack >= tracks.length) currentTrack = 0;

    loadTrack(currentTrack);
    audio.play();
    playBtn.innerHTML = "⏸";
    isPlaying = true;
  }

  audio.addEventListener("ended", function () {
    nextTrack({ stopPropagation: function(){} });
  });

  playBtn.addEventListener("click", togglePlay);
  skipBtn.addEventListener("click", nextTrack);

  loadTrack(0);
});

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
    if (e.target.closest(".controls")) return;
    widget.setPointerCapture(e.pointerId);
  });

  // ===== POINTER MOVE =====
  widget.addEventListener("pointermove", e => {

    if (isDragging) {
      var newLeft = e.clientX - offsetX;
var newTop = e.clientY - offsetY;

var maxLeft = window.innerWidth - widget.offsetWidth;
var maxTop = window.innerHeight - widget.offsetHeight;

if (newLeft < 0) newLeft = 0;
if (newTop < 0) newTop = 0;
if (newLeft > maxLeft) newLeft = maxLeft;
if (newTop > maxTop) newTop = maxTop;

widget.style.left = newLeft + "px";
widget.style.top = newTop + "px";
      
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