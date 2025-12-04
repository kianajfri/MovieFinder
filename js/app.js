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

    titleEl.textContent = show.name || "Unknown title";
  sumEl.textContent = show.summary
    ? show.summary.replace(/<[^>]+>/g, "") 
    : "No summary available.";

  yearEl.textContent = show.premiered
    ? show.premiered.slice(0, 4)
    : "Unknown year";

  genresEl.textContent = show.genres?.length
    ? show.genres.join(" · ")
    : "No genres";

      moreBtn.onclick = () => {
    window.location.href = `details.html?id=${show.id}`;
  };
}

function changeHeroSlide(direction = 1) {
  if (heroShows.length === 0) return;
  heroIndex = (heroIndex + direction + heroShows.length) % heroShows.length;
  renderHero();
}

function startHeroAutoPlay() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    changeHeroSlide(1);
  }, 5000);
}

async function initHero() {
  const data = await showsPage(1);

  if (!data) return;

heroShows = data
  .filter(s => s.image?.original)         
  .filter(s => s.rating?.average > 8)     
  .filter(s => s.summary && s.summary.length > 40) 
  .slice(0, 6);


  if (heroShows.length === 0) return;

  renderHero();
  startHeroAutoPlay();

   const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      changeHeroSlide(-1);
      startHeroAutoPlay();
    });

    nextBtn.addEventListener("click", () => {
      changeHeroSlide(1);
      startHeroAutoPlay();
    });
  }
}



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
initHero();