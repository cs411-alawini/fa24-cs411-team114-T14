import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRankingRequest } from "./RankingRequests";
import { RootState } from "../../app/store";
import Ranking from "../../types/Ranking/Ranking";

interface RankingState {
  rankings: Ranking | null;
  isLoading: boolean;
  error: string;
}

function getInitialRankingState(): RankingState {
  return {
    rankings: null,
    isLoading: false,
    error: "",
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
  },
});

const rankingReducer = rankingSlice.reducer;
export { fetchRankings };
export default rankingReducer;
