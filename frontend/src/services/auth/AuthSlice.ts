import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import RegisterInput from "../../types/auth/RegisterInput";
import { loginRequest, registerRequest } from "./AuthRequests";
import UserInfo from "../../types/auth/UserInfo";
import LoginInput from "../../types/auth/LoginInput";

interface AuthUserState {
  userInfo: UserInfo | null;
  isLoading: boolean;
  error: string;
}

function getInitialAuthUserState(): AuthUserState {
  const authUserState = {
    userInfo: null,
    isLoading: false,
    error: "",
  };
  if (localStorage.getItem("userInfo")) {
    authUserState.userInfo = JSON.parse(localStorage.getItem("userInfo")!);
  }
  return authUserState;
}

const register = createAsyncThunk<string, RegisterInput>(
  "user/register",
  async (registerInput: RegisterInput) => {
    return await registerRequest(registerInput);
  }
);

const login = createAsyncThunk<UserInfo, LoginInput>(
  "user/login",
  async (loginInput: LoginInput) => {
    return await loginRequest(loginInput);
  }
);

const logout = createAsyncThunk<string, void>("user/logout", async () => {
  return await Promise.resolve("Logged out");
});

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthUserState(),
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<AuthUserState>) => {
    builder
      .addCase(register.pending, (state) => {
        state.userInfo = null;
        state.isLoading = true;
        state.error = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.userInfo = null;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(register.rejected, (state, action) => {
        state.userInfo = null;
        state.isLoading = false;
        state.error = action.error.message!;
      });
    builder
      .addCase(login.pending, (state) => {
        state.userInfo = null;
        state.isLoading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isLoading = false;
        state.error = "";
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.userInfo = null;
        state.isLoading = false;
        state.error = action.error.message!;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.userInfo = null;
        state.isLoading = true;
        state.error = "";
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.isLoading = false;
        state.error = "";
        localStorage.removeItem("userInfo");
      })
      .addCase(logout.rejected, (state, action) => {
        state.userInfo = null;
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
});

const authReducer = authSlice.reducer;
export { register, login, logout };
export default authReducer;
