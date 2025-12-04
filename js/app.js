import {showsPage } from "./api.js";

let heroShows = [];
let heroIndex = 0;
let heroTimer = null;

function renderHero() {
  const heroSection = document.getElementById("hero");
  const titleEl = document.getElementById("heroTitle");
  const sumEl = document.getElementById("heroSummary");
  const yearEl = document.getElementById("heroYear");
  const genresEl = document.getElementById("heroGenres");
  const moreBtn = document.getElementById("heroMoreBtn");

  if (!heroSection || heroShows.length === 0) return;

  const show = heroShows[heroIndex];

   const bgImage =
    show.image?.original || show.image?.medium || "./assets/no-image.png";
  heroSection.style.backgroundImage = `url(${bgImage})`;

async function loadHomeMovies() {
  const movieGrid = document.getElementById("movieGrid");

  const data = await showsPage(0);

  if (!data) {
    movieGrid.innerHTML = "<p>Error loading movies</p>";
    return;
  }

  data.forEach(show => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${show.image?.medium || './assets/no-image.png'}" alt="${show.name}" />
      <div class="movie-card-info">
        <h4>${show.name}</h4>
        <span>${show.premiered || "Unknown"}</span>
      </div>
    `;
      card.addEventListener("click", () => {
      window.location.href = `details.html?id=${show.id}`;
    });

    movieGrid.appendChild(card);
  });
}
loadHomeMovies();