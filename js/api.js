const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "2d1acb7957f592b0a01dd14b1d13b090";

async function fetchData(endpoint) {
  try {
    const url = `${BASE_URL}${endpoint}&api_key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return null;
  }
}

export async function searchShows(query) {
  const data = await fetchData(`/search/movie?query=${encodeURIComponent(query)}`);
  return data?.results || [];
}

export async function getShowByName(query) {
  const results = await searchShows(query);
  if (!results.length) return null;

  const first = results[0];
  return fetchData(`/movie/${first.id}?append_to_response=credits,videos,images`);
}

export async function showsPage(page = 1) {
  const data = await fetchData(`/movie/popular?page=${page}`);
  if (!data) {
    return { results: [], page, total_pages: 1 };
  }

  return {
    results: data.results || [],
    page: data.page ?? page,
    total_pages: data.total_pages ?? 1
  };
}

const GENRES = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  thriller: 53
};

export async function getShowsByGenre(genre) {
  const genreId = GENRES[genre.toLowerCase()];
  if (!genreId) return [];
  const data = await fetchData(`/discover/movie?with_genres=${genreId}&page=1`);
  return data?.results || [];
}

export async function getShowById(id) {
  if (!id) return null;
  return fetchData(`/movie/${id}?append_to_response=videos,images,credits`);
}

export const GENRE_OPTIONS = Object.entries(GENRES).map(([key, id]) => ({
  key,
  id,
  label: key.charAt(0).toUpperCase() + key.slice(1)
}));
