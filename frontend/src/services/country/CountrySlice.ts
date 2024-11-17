import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import Citizenships from "../../types/country/Citizenships";
import { getCitizenShipsRequest } from "./CountryRequests";

interface CountryState {
  citizenships: Citizenships | null;
  isLoading: boolean;
  error: string;
}

function getInitialCountryState(): CountryState {
  return {
    citizenships: null,
    isLoading: false,
    error: "",
  };
}

const fetchCitizenships = createAsyncThunk<Citizenships, void>(
  "country/fetchCitizenships",
  async () => {
    return await getCitizenShipsRequest();
  }
);

const countrySlice = createSlice({
  name: "country",
  initialState: getInitialCountryState(),
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<CountryState>) => {
    builder
      .addCase(fetchCitizenships.pending, (state) => {
        state.citizenships = null;
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchCitizenships.fulfilled, (state, action) => {
        state.citizenships = action.payload;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(fetchCitizenships.rejected, (state, action) => {
        state.citizenships = null;
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
});

const countryReducer = countrySlice.reducer;
export { fetchCitizenships };
export default countryReducer;
