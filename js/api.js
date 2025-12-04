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

