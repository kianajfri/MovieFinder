import { getShowById } from "./api.js";

const container = document.getElementById("detailsContainer");
const statusBox = document.getElementById("detailsStatus");
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getYear(dateString) {
  return dateString ? dateString.slice(0, 4) : "Unknown";
}

function formatRuntime(runtime) {
  if (!runtime) return "Unknown runtime";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

function getImage(path, size = "w500") {
  return path ? `${TMDB_IMAGE_BASE}${size}${path}` : "../assets/no-image.png";
}

function chipList(genres = []) {
  if (!genres.length) return "<span class=\"chip\">No genres</span>";
  return genres.map(g => `<span class="chip">${g.name}</span>`).join("");
}

function crewNames(movie, jobs = []) {
  const crew = movie?.credits?.crew || [];
  const list = crew.filter(c => jobs.includes(c.job));
  return list.length ? list.map(c => c.name).join(" \u2022 ") : "Unknown";
}

function topCast(movie, count = 8) {
  const cast = movie?.credits?.cast || [];
  return cast.slice(0, count);
}

function galleryShots(movie, count = 4) {
  const shots = movie?.images?.backdrops || [];
  return shots.slice(0, count);
}

function renderMeta(label, value) {
  return `
    <div>
      <span class="meta-label">${label}</span>
      <span>${value}</span>
    </div>
  `;
}

function renderDetails(movie) {
  if (!container) return;

  const poster = getImage(movie.poster_path, "w500");
  const year = getYear(movie.release_date);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const voteCount = movie.vote_count ? `(${movie.vote_count.toLocaleString()})` : "";
  const runtime = formatRuntime(movie.runtime);
  const director = crewNames(movie, ["Director"]);
  const writers = crewNames(movie, ["Writer", "Screenplay", "Story", "Author"]);
  const stars = (movie?.credits?.cast || []).slice(0, 3).map(c => c.name).join(" \u2022 ") || "Unknown";
  const gallery = galleryShots(movie);
  const cast = topCast(movie, 12);

  container.innerHTML = `
    <article class="details-hero">
      <div class="details-poster-wrap">
        <img class="details-poster" src="${poster}" alt="${movie.title}" />
      </div>
      <div>
        <div class="details-headline">
          <h1 class="details-title">${movie.title || "Untitled"}</h1>
          <div class="rating-badge">&#9733; ${rating} <span class="count">${voteCount}</span></div>
        </div>
        <div class="details-meta">
          <span>${year}</span>
          <span>${runtime}</span>
          <span>${movie.original_language ? movie.original_language.toUpperCase() : "N/A"}</span>
        </div>
        <div class="genre-chips">${chipList(movie.genres)}</div>
        <p class="details-overview">${movie.overview || "No overview available."}</p>
        <div class="meta-grid">
          ${renderMeta("Director", director)}
          ${renderMeta("Writers", writers)}
          ${renderMeta("Stars", stars)}
        </div>
      </div>
    </article>

    <section class="section">
      <h3 class="section-title">Shots</h3>
      <div class="shots-grid">
        ${gallery.length ? gallery.map(img => `
          <div class="shot-card">
            <img src="${getImage(img.file_path, "w780")}" alt="Movie still" />
          </div>
        `).join("") : "<p>No images available.</p>"}
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">Cast</h3>
      <div class="cast-grid">
        ${cast.length ? cast.map(person => `
          <article class="cast-card">
            <img class="cast-photo" src="${getImage(person.profile_path, "w300")}" alt="${person.name}" />
            <div>
              <div class="cast-name">${person.name}</div>
              <div class="cast-role">${person.character || "Unknown role"}</div>
            </div>
          </article>
        `).join("") : "<p>No cast data available.</p>"}
      </div>
    </section>
  `;
}

async function init() {
  const id = getId();
  if (!id) {
    statusBox.textContent = "No movie selected.";
    return;
  }

  statusBox.textContent = "Loading movie...";
  const data = await getShowById(id);

  if (!data) {
    statusBox.textContent = "Could not load movie details.";
    return;
  }

  statusBox.textContent = "";
  renderDetails(data);
}

init();
