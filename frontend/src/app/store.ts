import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "../services/auth/AuthSlice";
import countryReducer from "../services/country/CountrySlice";
import userInputReducer from "../services/userinput/UserInputSlice";
import rankingReducer from "../services/ranking/RankingSlice";
import demographicsReducer from "../services/demographics/DemographicsSlice";
import searchLocationReducer from "../services/searchLocation/SearchLocationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    country: countryReducer,
    userinputs: userInputReducer,
    ranking: rankingReducer,
    demographics: demographicsReducer,
    searchLocation: searchLocationReducer,
  },
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export { type AppDispatch, type RootState, type AppThunk };
export default store;
