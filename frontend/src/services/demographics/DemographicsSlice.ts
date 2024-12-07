import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import CountryDetailResponse from "../../types/Dashboard/CountryDetailResponse";
import { fetchCountryDetailsRequest } from "./DemographicsRequests";

interface DemographicsState {
  countryDetail: CountryDetailResponse | null;
  isLoading: boolean;
  error: string;
}

function getInitialUserInputState(): DemographicsState {
  return {
    countryDetail: null,
    isLoading: false,
    error: "",
  };
}

const fetchCountryDetails = createAsyncThunk<
  CountryDetailResponse,
  string,
  { state: RootState }
>(
  "demographics/fetchCountryDetails",
  async function get(
    countryName: string,
    { getState }
  ): Promise<CountryDetailResponse> {
    const userInfo = getState().auth.userInfo;
    if (userInfo === null) {
      return Promise.reject("User not logged in");
    }
    return await fetchCountryDetailsRequest(userInfo.token, countryName);
  }
);

const DemographicsSlice = createSlice({
  name: "demographics",
  initialState: getInitialUserInputState(),
  reducers: {
    resetCountryDetail: () => getInitialUserInputState(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountryDetails.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchCountryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countryDetail = action.payload;
      })
      .addCase(fetchCountryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "";
      });
  },
});

const { resetCountryDetail } = DemographicsSlice.actions;
const demographicsReducer = DemographicsSlice.reducer;
export { fetchCountryDetails, resetCountryDetail };
export default demographicsReducer;
