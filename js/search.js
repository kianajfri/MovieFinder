import { searchShows } from "./api.js";

const grid = document.getElementById("searchGrid");
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const statusBox = document.getElementById("searchStatus");

function getQueryParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") || "";
}

function createCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "assets/no-image.png";

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "Unknown";

  card.innerHTML = `
    <img src="${imageUrl}" alt="${movie.title}" />
    <div class="movie-card-info">
      <h4>${movie.title}</h4>
      <div class="movie-meta">
        <span>${year}</span>
        <span class="rating">&#9733; ${rating}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `details.html?id=${movie.id}`;
  });

  return card;
}

async function runSearch(query) {
  if (!grid || !statusBox) return;
  if (!query) {
    statusBox.textContent = "Type a movie name and search.";
    grid.innerHTML = "";
    return;
  }

  statusBox.textContent = "Searching...";
  grid.innerHTML = "";

  const results = await searchShows(query);

  statusBox.textContent = results.length ? "" : `No results for "${query}".`;

  results.slice(0, 30).forEach(movie => {
    grid.appendChild(createCard(movie));
  });
}

function init() {
  if (!form || !input) return;
  const initial = getQueryParam();
  if (initial) {
    input.value = initial;
    runSearch(initial);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const query = input.value.trim();
    const params = new URLSearchParams(window.location.search);
    params.set("q", query);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    runSearch(query);
  });
}

init();
