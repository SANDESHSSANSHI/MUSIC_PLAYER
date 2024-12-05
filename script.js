// Select DOM elements
const play = document.querySelector(".play"),
  previous = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  trackImage = document.querySelector(".track-image"),
  title = document.querySelector(".title"),
  artist = document.querySelector(".artist"),
  trackCurrentTime = document.querySelector(".current-time"),
  trackDuration = document.querySelector(".duration-time"),
  slider = document.querySelector(".duration-slider"),
  showVolume = document.querySelector("#show-volume"),
  volumeIcon = document.querySelector("#volume-icon"),
  currentVolume = document.querySelector("#volume"),
  hamBurger = document.querySelector(".fa-bars"),
  closeIcon = document.querySelector(".fa-times"),
  musicPlaylist = document.querySelector(".music-playlist"),
  pDiv = document.querySelector(".playlist-div");

let timer;
let autoplay = false;
let indexTrack = 0;
let songIsPlaying = false;
let track = document.createElement("audio");

// Add Event Listeners
play.addEventListener("click", togglePlayPause);
next.addEventListener("click", nextSong);
previous.addEventListener("click", prevSong);
volumeIcon.addEventListener("click", muteSound);
currentVolume.addEventListener("input", changeVolume);
slider.addEventListener("input", changeDuration);
track.addEventListener("timeupdate", songTimeUpdate);
hamBurger.addEventListener("click", showPlayList); // Open Playlist
closeIcon.addEventListener("click", hidePlayList); // Close Playlist

// Load Tracks
function loadTrack(index) {
  clearInterval(timer);
  resetSlider();

  const currentTrack = trackList[index];
  track.src = currentTrack.path;
  trackImage.src = currentTrack.img;
  title.textContent = currentTrack.name;
  artist.textContent = currentTrack.singer;
  track.load();

  timer = setInterval(updateSlider, 1000);
}
loadTrack(indexTrack);

// Toggle Play or Pause
function togglePlayPause() {
  songIsPlaying ? pauseSong() : playSong();
}

// Play Song
function playSong() {
  track.play();
  songIsPlaying = true;
  play.innerHTML = '<i class="fas fa-pause"></i>';
}

// Pause Song
function pauseSong() {
  track.pause();
  songIsPlaying = false;
  play.innerHTML = '<i class="fas fa-play"></i>';
}

// Play Next Song
function nextSong() {
  indexTrack = (indexTrack + 1) % trackList.length;
  loadTrack(indexTrack);
  playSong();
}

// Play Previous Song
function prevSong() {
  indexTrack = (indexTrack - 1 + trackList.length) % trackList.length;
  loadTrack(indexTrack);
  playSong();
}

// Mute Sound
function muteSound() {
  track.volume = 0;
  currentVolume.value = 0;
  updateVolumeDisplay(0);
}

// Change Volume
function changeVolume() {
  const volume = currentVolume.value / 100;
  track.volume = volume;
  updateVolumeDisplay(currentVolume.value);
}

function updateVolumeDisplay(volume) {
  showVolume.textContent = volume;
}

// Change Track Duration
function changeDuration() {
  const position = (slider.value / 100) * track.duration;
  track.currentTime = position;
}

// Reset Slider
function resetSlider() {
  slider.value = 0;
}

// Update Slider Position
function updateSlider() {
  if (track.duration) {
    slider.value = (track.currentTime / track.duration) * 100;
  }

  if (track.ended) {
    play.innerHTML = '<i class="fas fa-play"></i>';
    if (autoplay) {
      nextSong();
    }
  }
}

// Update Current and Total Time
function songTimeUpdate() {
  const formatTime = (time) =>
    time < 10 ? `0${Math.floor(time)}` : Math.floor(time);

  const currentMins = formatTime(track.currentTime / 60);
  const currentSecs = formatTime(track.currentTime % 60);
  const durationMins = formatTime(track.duration / 60 || 0);
  const durationSecs = formatTime(track.duration % 60 || 0);

  trackCurrentTime.textContent = `${currentMins}:${currentSecs}`;
  trackDuration.textContent = `${durationMins}:${durationSecs}`;
}

// Show Playlist
function showPlayList() {
  musicPlaylist.style.transform = "translateX(0)"; // Open playlist
}

// Hide Playlist
function hidePlayList() {
  musicPlaylist.style.transform = "translateX(-100%)"; // Close playlist
}

// Display Tracks in Playlist
function displayTracks() {
  trackList.forEach((track, index) => {
    const div = document.createElement("div");
    div.classList.add("playlist");
    div.innerHTML = `
      <p class="single-song" data-index="${index}">${track.name}</p>`;
    pDiv.appendChild(div);
  });

  // Play Song from Playlist
  pDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("single-song")) {
      const songIndex = parseInt(e.target.getAttribute("data-index"));
      loadTrack(songIndex);
      playSong();
      hidePlayList();
    }
  });
}

// Initialize Playlist
displayTracks();
