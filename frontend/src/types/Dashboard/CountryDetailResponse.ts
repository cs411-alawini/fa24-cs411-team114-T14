import AverageRatings from "./AverageRatings";
import ClimateData from "./ClimateData";
import CountryData from "./CountryData";
import EconomyData from "./EconomyData";

interface CountryDetailResponse {
  country: CountryData;
  climate: ClimateData;
  economy: EconomyData;
  average_ratings: AverageRatings;
}

export default CountryDetailResponse;
