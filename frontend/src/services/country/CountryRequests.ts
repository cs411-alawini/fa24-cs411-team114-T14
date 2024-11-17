import apiEndpoints from "../../data/environment";
import Citizenships from "../../types/country/Citizenships";

async function getCitizenShipsRequest(): Promise<Citizenships> {
  const response = await fetch(apiEndpoints.citizenships);
  if (response.ok) {
    return Promise.resolve(response.json());
  }
  const errorMessage = await response.text();
  return Promise.reject(new Error(errorMessage));
}

export { getCitizenShipsRequest };
