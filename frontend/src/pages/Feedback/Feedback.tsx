import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import AddUserInputForm from "./components/AddUserInputForm";
import UserInputList from "./components/UserInputList";
import { fetchCitizenships } from "../../services/country/CountrySlice";

function Feedback() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCitizenships());
  }, [dispatch]);

  return (
    <>
      <AddUserInputForm />
      <UserInputList />
    </>
  );
}

export default Feedback;
