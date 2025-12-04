import { searchShows, showSingleSearch, showsPage } from "./api.js";

async function testAPI() {
  const search = await searchShows("friends");
  console.log("Search:", search);

  const singleSearch = await showSingleSearch("girls");
  console.log("singleSearch:", search);


  const page = await showsPage(3);
  console.log("Shows page:", page);
}

testAPI();
