import { showsPage } from "./api.js";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
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

let heroShows = [];
let heroIndex = 0;
let heroTimer = null;
let heroPaginationEl = null;
let currentPage = 1;
let totalPages = 1;

function formatGenres(genreIds = []) {
  const names = genreIds
    .map(id => TMDB_GENRES[id])
    .filter(Boolean);
  return names.length ? names.join(" / ") : "No genres";
}

function renderHeroGenres(container, genreIds = []) {
  if (!container) return;
  container.innerHTML = "";

  const names = genreIds
    .map(id => TMDB_GENRES[id])
    .filter(Boolean);

  if (!names.length) {
    container.textContent = "No genres";
    return;
  }

  names.forEach(name => {
    const chip = document.createElement("span");
    chip.className = "hero-genre-chip";
    chip.textContent = name;
    container.appendChild(chip);
  });
}

function getHeroImage(show) {
  if (show.backdrop_path) return `${TMDB_IMAGE_BASE}w1280${show.backdrop_path}`;
  if (show.poster_path) return `${TMDB_IMAGE_BASE}w780${show.poster_path}`;
  return "assets/no-image.png";
}

function renderHero() {
  const heroSection = document.getElementById("hero");
  const titleEl = document.getElementById("heroTitle");
  const sumEl = document.getElementById("heroSummary");
  const yearEl = document.getElementById("heroYear");
  const genresEl = document.getElementById("heroGenres");
  const moreBtn = document.getElementById("heroMoreBtn");

  if (!heroSection || heroShows.length === 0) return;

  const show = heroShows[heroIndex];

  const bgImage = getHeroImage(show);
  heroSection.style.backgroundImage = `url(${bgImage})`;

  titleEl.textContent = show.title || show.name || "Unknown title";
  sumEl.textContent = show.overview || "No summary available.";

  yearEl.textContent = show.release_date
    ? show.release_date.slice(0, 4)
    : "Unknown year";

  renderHeroGenres(genresEl, show.genre_ids);

  moreBtn.onclick = () => {
    window.location.href = `details.html?id=${show.id}`;
  };

  updateHeroDots();
}

function updateHeroDots() {
  if (!heroPaginationEl) return;

  const dots = heroPaginationEl.querySelectorAll(".hero-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === heroIndex);
  });
}

function renderHeroPagination() {
  heroPaginationEl = document.getElementById("heroPagination");
  if (!heroPaginationEl) return;

  heroPaginationEl.innerHTML = "";

  heroShows.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = `hero-dot${idx === heroIndex ? " active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
    dot.addEventListener("click", () => {
      goToHeroSlide(idx);
      startHeroAutoPlay();
    });
    heroPaginationEl.appendChild(dot);
  });
}

function goToHeroSlide(index) {
  if (heroShows.length === 0) return;
  heroIndex = (index + heroShows.length) % heroShows.length;
  renderHero();
}

function changeHeroSlide(direction = 1) {
  goToHeroSlide(heroIndex + direction);
}

function startHeroAutoPlay() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    changeHeroSlide(1);
  }, 5000);
}

async function initHero() {
  const data = await showsPage(1);

  if (!data || !data.results) return;

  heroShows = data.results
    .filter(s => s.backdrop_path || s.poster_path)
    .filter(s => s.vote_average && s.vote_average >= 7)
    .filter(s => s.overview && s.overview.length > 40)
    .slice(0, 6);

  if (heroShows.length === 0) return;

  renderHero();
  startHeroAutoPlay();
  renderHeroPagination();
}

function getYear(dateString) {
  return dateString ? dateString.slice(0, 4) : "Unknown";
}

function renderMovieCards(movies) {
  const movieGrid = document.getElementById("movieGrid");
  movieGrid.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "assets/no-image.png";

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const year = getYear(movie.release_date);
    const genres = formatGenres(movie.genre_ids);

    card.innerHTML = `
      <div class="movie-poster">
        <img src="${imageUrl}" alt="${movie.title}" />
        <button class="details-btn" type="button">Details</button>
      </div>
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

    const detailsBtn = card.querySelector(".details-btn");
    detailsBtn.addEventListener("click", e => {
      e.stopPropagation();
      window.location.href = `details.html?id=${movie.id}`;
    });

    movieGrid.appendChild(card);
  });
}

function createPageButton({ label, page, disabled = false, active = false }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = "page-chip";
  if (active) btn.classList.add("active");
  if (disabled) btn.classList.add("disabled");

  if (!disabled && page !== null) {
    btn.addEventListener("click", () => loadHomeMovies(page));
  }
  return btn;
}

function buildPageList(total, current) {
  const pages = [];
  const add = p => {
    if (p >= 1 && p <= total && !pages.includes(p)) pages.push(p);
  };

  add(1);
  add(total);
  for (let p = current - 1; p <= current + 1; p += 1) add(p);
  add(2);
  add(total - 1);

  pages.sort((a, b) => a - b);

  const output = [];
  for (let i = 0; i < pages.length; i += 1) {
    output.push(pages[i]);
    if (pages[i + 1] && pages[i + 1] - pages[i] > 1) {
      output.push("ellipsis");
    }
  }
  return output;
}

function renderPagination() {
  const paginationEl = document.getElementById("moviePagination");
  paginationEl.innerHTML = "";

  const total = Math.min(totalPages, 25);

  paginationEl.appendChild(
    createPageButton({
      label: "<",
      page: currentPage > 1 ? currentPage - 1 : null,
      disabled: currentPage === 1
    })
  );

  buildPageList(total, currentPage).forEach(item => {
    if (item === "ellipsis") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "page-ellipsis";
      ellipsis.textContent = "...";
      paginationEl.appendChild(ellipsis);
      return;
    }

    paginationEl.appendChild(
      createPageButton({
        label: String(item),
        page: item,
        active: item === currentPage
      })
    );
  });

  paginationEl.appendChild(
    createPageButton({
      label: ">",
      page: currentPage < total ? currentPage + 1 : null,
      disabled: currentPage === total
    })
  );
}

async function loadHomeMovies(page = 1) {
  const movieGrid = document.getElementById("movieGrid");
  const paginationEl = document.getElementById("moviePagination");

  movieGrid.innerHTML = "";
  paginationEl.innerHTML = "";

  const data = await showsPage(page);

  if (!data || !data.results) {
    movieGrid.innerHTML = "<p>Error loading movies</p>";
    return;
  }

  currentPage = data.page || page;
  totalPages = data.total_pages || 1;

  renderMovieCards(data.results);
  renderPagination();
}

loadHomeMovies();
initHero();
