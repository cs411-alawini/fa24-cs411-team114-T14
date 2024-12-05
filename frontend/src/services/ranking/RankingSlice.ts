import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAverageClimateRatingOfCountry,
  getRankingRequest,
} from "./RankingRequests";
import { RootState } from "../../app/store";
import Ranking from "../../types/Ranking/Ranking";
import AverageClimateRating from "../../types/Ranking/AverageClimateRating";

interface RankingState {
  rankings: Ranking | null;
  isLoading: boolean;
  error: string;
  averageClimateRatings: AverageClimateRating[] | null;
  isLoadingAverageClimateRatings: boolean;
  errorAverageClimateRatings: string;
}

function getInitialRankingState(): RankingState {
  return {
    rankings: null,
    isLoading: false,
    error: "",
    averageClimateRatings: null,
    isLoadingAverageClimateRatings: false,
    errorAverageClimateRatings: "",
  };
}

const fetchRankings = createAsyncThunk<Ranking, void, { state: RootState }>(
  "ranking/fetchEnergyDeficitRankings",
  async function get(_, { getState }): Promise<Ranking> {
    const userInfo = getState().auth.userInfo;
    if (userInfo === null) {
      return Promise.reject("User not logged in");
    }
    return await getRankingRequest(userInfo.token);
  }
);

const fetchAverageClimateRatings = createAsyncThunk<
  AverageClimateRating[],
  { dateVisitedFrom: string; dateVisitedTo: string },
  { state: RootState }
>(
  "ranking/fetchAverageClimateRatings",
  async function get(
    { dateVisitedFrom, dateVisitedTo },
    { getState }
  ): Promise<AverageClimateRating[]> {
    const userInfo = getState().auth.userInfo;
    if (userInfo === null) {
      return Promise.reject("User not logged in");
    }
    return await getAverageClimateRatingOfCountry(
      userInfo.token,
      dateVisitedFrom,
      dateVisitedTo
    );
  }
);

const rankingSlice = createSlice({
  name: "ranking",
  initialState: getInitialRankingState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRankings.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rankings = action.payload;
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "";
      });
    builder
      .addCase(fetchAverageClimateRatings.pending, (state) => {
        state.isLoadingAverageClimateRatings = true;
        state.errorAverageClimateRatings = "";
      })
      .addCase(fetchAverageClimateRatings.fulfilled, (state, action) => {
        state.isLoadingAverageClimateRatings = false;
        state.averageClimateRatings = action.payload;
      })
      .addCase(fetchAverageClimateRatings.rejected, (state, action) => {
        state.isLoadingAverageClimateRatings = false;
        state.errorAverageClimateRatings = action.error.message || "";
      });
  },
});

const rankingReducer = rankingSlice.reducer;
export { fetchRankings, fetchAverageClimateRatings };
export default rankingReducer;
