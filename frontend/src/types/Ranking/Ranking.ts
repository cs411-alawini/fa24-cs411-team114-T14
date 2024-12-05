import EnergyDeficit from "./EnergyDeficit";
import FavoriteClimateCountryCount from "./FavoriteClimateCountryCount";

interface Ranking {
  countriesWithPoorCO2EmissionsAndForestedArea: string[];
  energyDeficitPerCountry: EnergyDeficit[];
  favoriteClimateCountryCounts: FavoriteClimateCountryCount[];
}

export default Ranking;
