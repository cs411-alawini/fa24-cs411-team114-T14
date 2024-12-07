import { RootState } from "../../app/store";

const selectCountryDetails = (state: RootState) =>
  state.demographics.countryDetail;
const selectCountryDetailsIsLoading = (state: RootState) =>
  state.demographics.isLoading;
const selectCountryDetailsError = (state: RootState) =>
  state.demographics.error;

export {
  selectCountryDetails,
  selectCountryDetailsIsLoading,
  selectCountryDetailsError,
};
