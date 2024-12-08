import { Alert, Table } from "react-bootstrap";
import { selectAverageClimateRatings } from "../../../services/ranking/RankingSelectors";
import { useAppSelector } from "../../../app/hooks";

function AverageClimateRatingTable() {
  const averageClimateRatings = useAppSelector(selectAverageClimateRatings);

  if (averageClimateRatings === null) {
    return (
      <Alert variant="warning">Submit duration to get climate ratings</Alert>
    );
  }

  if (averageClimateRatings.length === 0) {
    return (
      <Alert variant="warning">
        Submitted duration does not contain any feedback, try another duration
      </Alert>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Country</th>
          <th>Average Climate Rating</th>
          <th>Climate impact</th>
        </tr>
      </thead>
      <tbody>
        {averageClimateRatings.map((averageClimateRating) => (
          <tr key={averageClimateRating.country}>
            <td>{averageClimateRating.country}</td>
            <td>{averageClimateRating.averageClimateRating}</td>
            <td>{averageClimateRating.label}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AverageClimateRatingTable;
