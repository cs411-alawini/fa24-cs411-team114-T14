import apiEndpoints from "../../data/environment";
import AverageClimateRating from "../../types/Ranking/AverageClimateRating";
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

async function getAverageClimateRatingOfCountry(
  token: string,
  dateVisitedFrom: string,
  dateVisitedTo: string
): Promise<AverageClimateRating[]> {
  const response = await fetch(
    `${apiEndpoints.averageClimateRatingOfCountry}?date_visited_from=${dateVisitedFrom}&date_visited_to=${dateVisitedTo}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.ok) {
    return Promise.resolve(response.json());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

export { getRankingRequest, getAverageClimateRatingOfCountry };
