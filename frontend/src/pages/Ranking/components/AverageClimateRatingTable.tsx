import { Alert, Table } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { selectAverageClimateRatings } from "../../services/ranking/RankingSelectors";

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
        </tr>
      </thead>
      <tbody>
        {averageClimateRatings.map((averageClimateRating) => (
          <tr key={averageClimateRating.country}>
            <td>{averageClimateRating.country}</td>
            <td>{averageClimateRating.averageClimateRating}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AverageClimateRatingTable;
