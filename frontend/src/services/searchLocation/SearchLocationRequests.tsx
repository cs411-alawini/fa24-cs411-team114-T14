import apiEndpoints from "../../data/environment";
import SearchResult from "../../types/searchLocation/SearchResult";

async function getSearchLocationResultsRequest(
  token: string,
  searchTerm: string
): Promise<SearchResult[]> {
  const response = await fetch(apiEndpoints.searchLocation(searchTerm), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return Promise.resolve(response.json());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

export { getSearchLocationResultsRequest };
