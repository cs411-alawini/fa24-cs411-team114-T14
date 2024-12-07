const base_url = "http://127.0.0.1:5000";
const apiEndpoints = {
  citizenships: `${base_url}/citizenships`,
  register: `${base_url}/register`,
  login: `${base_url}/login`,
  userInputs: `${base_url}/user_input`,
  ranking: `${base_url}/ranking`,
  averageClimateRatingOfCountry: `${base_url}/average_climate_rating_of_country`,
  countryDetails: (name: string) =>
    `${base_url}/country/${encodeURIComponent(name || "")}`,
  searchLocation: (searchTerm: string) =>
    `${base_url}/search_location/${encodeURIComponent(searchTerm || "")}`,
};

export default apiEndpoints;
