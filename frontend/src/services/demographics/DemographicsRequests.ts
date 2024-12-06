import apiEndpoints from "../../data/environment";
import CountryDetailResponse from "../../types/Dashboard/CountryDetailResponse";

async function fetchCountryDetailsRequest(
  token: string,
  countryName: string
): Promise<CountryDetailResponse> {
  const response = await fetch(apiEndpoints.countryDetails(countryName), {
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

export { fetchCountryDetailsRequest };
