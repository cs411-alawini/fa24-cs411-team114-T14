import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "../services/auth/AuthSlice";
import countryReducer from "../services/country/CountrySlice";
import userInputReducer from "../services/userinput/UserInputSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    country: countryReducer,
    userinputs: userInputReducer,
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
