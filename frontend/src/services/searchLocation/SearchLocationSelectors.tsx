import { RootState } from "../../app/store";

const selectSearchLocationResults = (state: RootState) =>
  state.searchLocation.searchResults;
const selectSearchLocationIsLoading = (state: RootState) =>
  state.searchLocation.isLoading;
const selectSearchLocationError = (state: RootState) =>
  state.searchLocation.error;

export {
  selectSearchLocationResults,
  selectSearchLocationIsLoading,
  selectSearchLocationError,
};
