import { getShowsByGenre, GENRE_OPTIONS } from "./api.js";

const TMDB_GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

const dropdown = document.getElementById("genreSelect");
const grid = document.getElementById("genreGrid");
const statusBox = document.getElementById("genreStatus");
const initialGenre = new URLSearchParams(window.location.search).get("genre");

function formatGenres(ids = []) {
  const names = ids.map(id => TMDB_GENRES[id]).filter(Boolean);
  return names.length ? names.join(" / ") : "No genres";
}

function renderOptions() {
  GENRE_OPTIONS.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt.key;
    option.textContent = opt.label;
    dropdown.appendChild(option);
  });
}

function createCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "assets/no-image.png";

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "Unknown";
  const genres = formatGenres(movie.genre_ids);

  card.innerHTML = `
    <img src="${imageUrl}" alt="${movie.title}" />
    <div class="movie-card-info">
      <h4>${movie.title}</h4>
      <div class="movie-meta">
        <span>${year}</span>
        <span class="rating">&#9733; ${rating}</span>
      </div>
      <span class="movie-genres">${genres}</span>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `details.html?id=${movie.id}`;
  });

  return card;
}

async function loadGenre(genreKey) {
  statusBox.textContent = `Loading ${genreKey} movies...`;
  grid.innerHTML = "";

  const movies = await getShowsByGenre(genreKey);
  statusBox.textContent = movies.length ? "" : "No movies found for this genre.";

  movies.slice(0, 20).forEach(movie => {
    grid.appendChild(createCard(movie));
  });
}

function init() {
  if (!dropdown || !grid) return;

  renderOptions();

  const desiredGenre = initialGenre?.toLowerCase();
  const matched = desiredGenre
    ? GENRE_OPTIONS.find(opt => opt.key.toLowerCase() === desiredGenre)
    : null;

  if (matched) {
    dropdown.value = matched.key;
  } else if (!dropdown.value && GENRE_OPTIONS[0]) {
    dropdown.value = GENRE_OPTIONS[0].key;
  }

  dropdown.addEventListener("change", e => {
    loadGenre(e.target.value);
  });

  loadGenre(dropdown.value);
}

init();
