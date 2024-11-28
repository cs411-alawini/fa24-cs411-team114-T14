import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import { selectUserInputs } from "../../../services/userinput/UserInputSelectors";
import AddUserInputForm from "./AddUserInputForm";
import { dashboardFeedback } from "../../../routes";

function EditUserInputForm(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const userInputs = useAppSelector(selectUserInputs);
  if (id === undefined) {
    navigate(dashboardFeedback);
    return <></>;
  }
  const userInputID = parseInt(id);
  const defaultValues = userInputs.find(
    (userInput) => userInput.userInputID === userInputID
  );
  if (defaultValues === undefined) {
    navigate(dashboardFeedback);
    return <></>;
  }
  return (
    <>
      <AddUserInputForm isEdit={true} defaultValues={defaultValues} />
    </>
  );
}

export default EditUserInputForm;
