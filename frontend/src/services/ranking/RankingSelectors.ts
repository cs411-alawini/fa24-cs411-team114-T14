import { RootState } from "../../app/store";

const selectRanking = (state: RootState) => state.ranking.rankings;
const selectIsLoading = (state: RootState) => state.ranking.isLoading;
const selectError = (state: RootState) => state.ranking.error;
const selectAverageClimateRatings = (state: RootState) =>
  state.ranking.averageClimateRatings;
const selectIsLoadingAverageClimateRatings = (state: RootState) =>
  state.ranking.isLoadingAverageClimateRatings;
const selectErrorAverageClimateRatings = (state: RootState) =>
  state.ranking.errorAverageClimateRatings;

export {
  selectRanking,
  selectIsLoading,
  selectError,
  selectAverageClimateRatings,
  selectIsLoadingAverageClimateRatings,
  selectErrorAverageClimateRatings,
};
