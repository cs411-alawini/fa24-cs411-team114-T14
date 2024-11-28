import { Alert, Button, Container, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectUserInputs } from "../../../services/userinput/UserInputSelectors";
import {
  deleteUserInput,
  fetchUserInputs,
} from "../../../services/userinput/UserInputSlice";

function UserInputList() {
  const userInputs = useAppSelector(selectUserInputs);
  const dispatch = useAppDispatch();

  if (userInputs.length === 0) {
    return (
      <Container className="mt-3 mb-3">
        <Alert variant="warning">No feedback found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-3 mb-3">
      <h4 className="h4">Feedback</h4>
      <Table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Dates visited</th>
            <th>Food Rating</th>
            <th>Hospital Rating</th>
            <th>Climate Rating</th>
            <th>Tourism Rating</th>
            <th>Safety Rating</th>
            <th>Cost of Living Rating</th>
            <th>Culture and Entertainment Rating</th>
            <th>Infrastructure Rating</th>
            <th>Healthcare Rating</th>
            <th>Comments</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userInputs.map((userInput) => (
            <tr key={userInput.userInputID}>
              <td>{userInput.country}</td>
              <td>
                {userInput.dateVisitedFrom} - {userInput.dateVisitedTo}
              </td>
              <td>{userInput.foodRating}</td>
              <td>{userInput.hospitalRating}</td>
              <td>{userInput.climateRating}</td>
              <td>{userInput.tourismRating}</td>
              <td>{userInput.safetyRating}</td>
              <td>{userInput.costOfLivingRating}</td>
              <td>{userInput.cultureEntertainmentRating}</td>
              <td>{userInput.infrastructureRating}</td>
              <td>{userInput.healthcareRating}</td>
              <td>{userInput.comments}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={async () => {
                    await dispatch(deleteUserInput(userInput.userInputID)).then(
                      () => {
                        dispatch(fetchUserInputs());
                      }
                    );
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserInputList;
