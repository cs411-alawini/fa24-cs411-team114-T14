import { RootState } from "../../app/store";

const selectUserInputs = (state: RootState) => state.userinputs.userInputs;
const selectUserInputsIsLoading = (state: RootState) =>
  state.userinputs.isLoading;
const selectUserInputsError = (state: RootState) => state.userinputs.error;

export { selectUserInputs, selectUserInputsIsLoading, selectUserInputsError };
