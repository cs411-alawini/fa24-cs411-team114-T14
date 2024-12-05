import { RootState } from "../../app/store";

const selectRanking = (state: RootState) => state.ranking.rankings;
const selectIsLoading = (state: RootState) => state.ranking.isLoading;
const selectError = (state: RootState) => state.ranking.error;

export { selectRanking, selectIsLoading, selectError };
