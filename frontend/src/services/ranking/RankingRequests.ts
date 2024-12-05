import apiEndpoints from "../../data/environment";
import Ranking from "../../types/Ranking/Ranking";

async function getRankingRequest(token: string): Promise<Ranking> {
  const response = await fetch(`${apiEndpoints.ranking}`, {
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

export { getRankingRequest };
