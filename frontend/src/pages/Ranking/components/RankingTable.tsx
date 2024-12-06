import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Alert, Container, Table } from "react-bootstrap";
import { selectCitizenships } from "../../../services/country/CountrySelectors";
import { selectRanking } from "../../../services/ranking/RankingSelectors";

function RankingTable() {
  const citizenships = useSelector(selectCitizenships);
  const ranking = useSelector(selectRanking);

  const combinedData = useMemo(() => {
    if (ranking === null || citizenships === null) {
      return [];
    }

    const data = Object.keys(citizenships).map((country) => {
      const energyDeficit = ranking.energyDeficitPerCountry.find(
        (energyDeficit) => energyDeficit.country === country
      );
      const favoriteClimateCountryCount =
        ranking.favoriteClimateCountryCounts.find(
          (favoriteClimateCountryCount) =>
            favoriteClimateCountryCount.country === country
        );
      const isPoorCO2EmissionsAndForestedArea =
        ranking.countriesWithPoorCO2EmissionsAndForestedArea.includes(country);
      return {
        country,
        energyDeficit: energyDeficit ? energyDeficit.energyDeficit : null,
        favoriteClimateCountryCount: favoriteClimateCountryCount
          ? favoriteClimateCountryCount.favoriteCount
          : null,
        isPoorCO2EmissionsAndForestedArea: isPoorCO2EmissionsAndForestedArea
          ? true
          : false,
      };
    });

    data.sort((a, b) => {
      if (a.energyDeficit === null && b.energyDeficit === null) {
        return 0;
      }
      if (a.energyDeficit === null) {
        return 1;
      }
      if (b.energyDeficit === null) {
        return -1;
      }
      return -(a.energyDeficit - b.energyDeficit);
    });

    return data;
  }, [citizenships, ranking]);

  if (ranking === null || citizenships === null) {
    return (
      <Container className="mt-3 mb-3">
        <Alert variant="warning">No ranking found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-3 mb-3">
      <h2 className="h2">Ranking</h2>
      <Table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Energy deficit</th>
            <th>Number of people who gave highest climate rating</th>
            <th>
              Countries with higher than average CO2 emissions and lower than
              average forested area
            </th>
          </tr>
        </thead>
        <tbody>
          {combinedData.map((data) => (
            <tr key={data.country}>
              <td>{data.country}</td>
              <td>{data.energyDeficit}</td>
              <td>{data.favoriteClimateCountryCount}</td>
              <td>
                {data.isPoorCO2EmissionsAndForestedArea ? "True" : "False"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default RankingTable;
