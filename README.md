# Movie Finder

Lightweight movie search and discovery built with plain HTML, CSS, and vanilla JavaScript—no frameworks or UI libraries.

## Live Demo
- https://kianajfri.github.io/MovieFinder/
- Note: Must be opened with a VPN to work.
## Features
- Search movies, view details (poster, rating, genres, overview), and jump to a dedicated details page.
- Popular movies with pagination and a hero carousel of highly rated titles.
- Genre quick-links and inline search suggestions from the navbar.
- Responsive layout and image fallbacks for missing posters/backdrops.

## Stack & Tools
- HTML5, CSS3, JavaScript (ES modules), Fetch API.
- No frontend frameworks or CSS libraries.

## API (The Movie Database)
Base: `https://api.themoviedb.org/3`  

Endpoints used:
- `GET /search/movie?query={query}` — typeahead suggestions and full search results.
- `GET /movie/{id}?append_to_response=credits,videos,images` — details page with extras.
- `GET /movie/popular?page={page}` — homepage listing + hero source.
- `GET /discover/movie?with_genres={genreId}&page=1` — genre page listings.

Authentication: API key passed as `api_key` query param (see `js/api.js`). Replace the placeholder key with your own TMDB key.

## Project Structure
- `index.html` — homepage layout and hero.
- `search.html`, `genre.html`, `details.html`, `api.html` — supporting views.
- `css/style.css` — custom styling.
- `js/api.js` — TMDB API helpers (fetch, search, details, popular, genre).
- `js/app.js` — homepage logic (hero carousel, cards, pagination).
- `js/nav.js` — navbar dropdowns and search suggestions.


## Contact
- GitHub: https://github.com/kianajfri
- Email: kianajafari100@gmail.com
