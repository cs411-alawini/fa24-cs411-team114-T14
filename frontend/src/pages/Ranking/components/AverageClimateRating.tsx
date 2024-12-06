import { Container } from "react-bootstrap";
import AverageClimateRatingForm from "./AverageClimateRatingForm";
import AverageClimateRatingTable from "./AverageClimateRatingTable";

function AverageClimateRating() {
  return (
    <Container>
      <h2 className="h2 mt-4">Average climate rating</h2>
      <div className="mt-4">
        <AverageClimateRatingForm />
      </div>
      <div className="mt-4">
        <AverageClimateRatingTable />
      </div>
    </Container>
  );
}

export default AverageClimateRating;
