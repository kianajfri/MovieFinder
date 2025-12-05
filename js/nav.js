import { GENRE_OPTIONS, searchShows } from "./api.js";

const dropdown = document.querySelector("[data-genre-dropdown]");
const toggleBtn = document.querySelector("[data-genre-toggle]");
const list = document.querySelector("[data-genre-list]");
const searchForms = Array.from(document.querySelectorAll(".search-box"));

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
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
const BASE_PATH = window.location.pathname.includes("/MovieFinder/") ? "/MovieFinder/" : "/";

let openSearchDropdown = null;

function closeDropdown() {
  dropdown?.classList.remove("open");
  toggleBtn?.setAttribute("aria-expanded", "false");
}

function openDropdown() {
  if (!dropdown) return;
  dropdown.classList.add("open");
  toggleBtn?.setAttribute("aria-expanded", "true");
}

function toggleDropdown() {
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains("open");
  if (isOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function buildList() {
  if (!list) return;
  list.innerHTML = "";

  GENRE_OPTIONS.forEach(opt => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "menu-dropdown-item";
    item.textContent = opt.label;
    item.addEventListener("click", () => {
      window.location.href = `${BASE_PATH}genre.html?genre=${encodeURIComponent(opt.key)}`;
    });
    list.appendChild(item);
  });
}

function handleClickOutside(e) {
  if (!dropdown) return;
  if (dropdown.contains(e.target)) return;
  closeDropdown();
}

function handleKeydown(e) {
  if (e.key === "Escape") closeDropdown();
}

function initNavDropdown() {
  if (!dropdown || !toggleBtn || !list) return;
  buildList();
  toggleBtn.addEventListener("click", toggleDropdown);
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
}

function debounce(fn, delay = 250) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function closeSearchBox(drop) {
  if (!drop) return;
  drop.classList.remove("open");
  drop.innerHTML = "";
  if (openSearchDropdown === drop) openSearchDropdown = null;
}

function formatGenres(ids = []) {
  const names = ids.map(id => TMDB_GENRES[id]).filter(Boolean);
  return names.length ? names.join(" / ") : "No genres";
}

function escapeAttr(value = "") {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function searchItemTemplate(movie) {
  const title = movie.title || movie.name || "Untitled";
  const poster = movie.poster_path ? `${TMDB_IMAGE_BASE}w154${movie.poster_path}` : "../assets/no-image.png";
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "Unknown";
  const genres = formatGenres(movie.genre_ids);

  return `
    <button class="search-dropdown-item" type="button" data-id="${movie.id}">
      <img src="${poster}" alt="${title}" />
      <div class="search-dropdown-body">
        <div class="search-dropdown-title">${title}</div>
        <div class="search-dropdown-meta">${genres} â€¢ ${year}</div>
      </div>
    </button>
  `;
}

function renderSearchResults(drop, results, query) {
  if (!drop) return;
  if (!results.length) {
    drop.innerHTML = `<div class="search-dropdown-empty">No results for "${query}".</div>`;
    drop.classList.add("open");
    openSearchDropdown = drop;
    return;
  }

  const limited = results.slice(0, 8);
  drop.innerHTML = `
    <div class="search-dropdown-list">
      ${limited.map(searchItemTemplate).join("")}
    </div>
    <button class="search-dropdown-all" type="button" data-query="${escapeAttr(query)}">
      View all results for "${query}"
    </button>
  `;
  drop.classList.add("open");
  openSearchDropdown = drop;
}

function handleDropdownClick(e, input, drop) {
  const item = e.target.closest("[data-id]");
  const viewAll = e.target.closest(".search-dropdown-all");

  if (item) {
    const id = item.getAttribute("data-id");
    if (id) window.location.href = `${BASE_PATH}details.html?id=${id}`;
    closeSearchBox(drop);
  } else if (viewAll) {
    const query = viewAll.getAttribute("data-query") || input.value.trim();
    window.location.href = `${BASE_PATH}search.html?q=${encodeURIComponent(query)}`;
  }
}

function setupSearchDropdowns() {
  if (!searchForms.length) return;

  document.addEventListener("click", e => {
    if (openSearchDropdown && !openSearchDropdown.contains(e.target) && !openSearchDropdown.parentElement.contains(e.target)) {
      closeSearchBox(openSearchDropdown);
    }
  });

  searchForms.forEach(form => {
    const input = form.querySelector("input[type='text'], input[type='search'], input[name='q']");
    if (!input) return;

    let drop = form.querySelector(".search-dropdown");
    if (!drop) {
      drop = document.createElement("div");
      drop.className = "search-dropdown";
      form.appendChild(drop);
    }

    const runSearch = debounce(async value => {
      const query = value.trim();
      if (query.length < 2) {
        closeSearchBox(drop);
        return;
      }

      drop.innerHTML = `<div class="search-dropdown-empty">Searching...</div>`;
      drop.classList.add("open");
      openSearchDropdown = drop;

      const results = await searchShows(query);

      // Guard against stale results if the user kept typing.
      if (input.value.trim() !== query) return;

      renderSearchResults(drop, results, query);
    }, 300);

    input.addEventListener("input", e => {
      runSearch(e.target.value);
    });

    input.addEventListener("focus", () => {
      if (drop.innerHTML.trim()) drop.classList.add("open");
    });

    form.addEventListener("submit", () => closeSearchBox(drop));

    drop.addEventListener("click", e => handleDropdownClick(e, input, drop));
  });
}

initNavDropdown();
setupSearchDropdowns();
