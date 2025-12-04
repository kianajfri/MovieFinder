const BASE_URL = "https://api.tvmaze.com";

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);

    if (!res.ok) {
      throw new Error("API request failed");
    }

    return await res.json();

  } catch (error) {
    console.error("API Error:", error);
    return null; 
  }
}

export async function searchShows(query) {
  return fetchData(`/search/shows?q=${encodeURIComponent(query)}`);
}

export async function getShowByName(query) {
  return fetchData(`/singlesearch/shows?q=${encodeURIComponent(query)}`);
}

 export async function showsPage(page = 0) {
  return fetchData(`/shows?page=${page}`);
}

export async function getShowsByGenre(genre, page = 0) {
  const data = await showsPage(page);

  if (!data) return [];

  return data.filter(show =>
    show.genres?.map(g => g.toLowerCase()).includes(genre.toLowerCase())
  );
}