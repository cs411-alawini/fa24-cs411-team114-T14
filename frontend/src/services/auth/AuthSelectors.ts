import { RootState } from "../../app/store";

const selectAuthUser = (state: RootState) => state.auth.userInfo;
const selectAuthUserIsLoading = (state: RootState) => state.auth.isLoading;
const selectAuthUserError = (state: RootState) => state.auth.error;

export { selectAuthUser, selectAuthUserIsLoading, selectAuthUserError };
