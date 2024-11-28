import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserInput from "../../types/userinput/UserInput";
import {
  addUserInputRequest,
  deleteUserInputRequest,
  editUserInputRequest as putUserInputRequest,
  getUserInputsRequest,
} from "./UserInputRequests";
import { RootState } from "../../app/store";
import AddUserInput from "../../types/userinput/AddUserInput";
import EditUserInput from "../../types/userinput/EditUserInput";

interface UserInputState {
  userInputs: UserInput[];
  isLoading: boolean;
  error: string;
}

function getInitialUserInputState(): UserInputState {
  return {
    userInputs: [],
    isLoading: false,
    error: "",
  };
}

const fetchUserInputs = createAsyncThunk<
  UserInput[],
  void,
  { state: RootState }
>("userinput/fetchUserInputs", async function get(_, { getState }): Promise<
  UserInput[]
> {
  const userInfo = getState().auth.userInfo;
  if (userInfo === null) {
    return Promise.reject("User not logged in");
  }
  return await getUserInputsRequest(userInfo.token);
});

const postUserInput = createAsyncThunk<
  string,
  AddUserInput,
  { state: RootState }
>(
  "userinput/addUserInput",
  async function add(
    addUserInput: AddUserInput,
    { getState }
  ): Promise<string> {
    const userInfo = getState().auth.userInfo;
    if (userInfo === null) {
      return Promise.reject("User not logged in");
    }
    return await addUserInputRequest(userInfo.token, addUserInput);
  }
);

const putUserInput = createAsyncThunk<
  string,
  EditUserInput,
  { state: RootState }
>(
  "userinput/editUserInput",
  async function edit(
    editUserInput: EditUserInput,
    { getState }
  ): Promise<string> {
    const userInfo = getState().auth.userInfo;
    if (userInfo === null) {
      return Promise.reject("User not logged in");
    }
    return await putUserInputRequest(userInfo.token, editUserInput);
  }
);

const deleteUserInput = createAsyncThunk<string, number, { state: RootState }>(
  "userinput/deleteUserInput",
  async function remove(userInputID: number, { getState }): Promise<string> {
    const userInfo = getState().auth.userInfo;
    if (userInfo === null) {
      return Promise.reject("User not logged in");
    }
    return await deleteUserInputRequest(userInfo.token, userInputID);
  }
);

const userInputSlice = createSlice({
  name: "userinput",
  initialState: getInitialUserInputState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInputs.pending, (state) => {
        state.userInputs = [];
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchUserInputs.fulfilled, (state, action) => {
        state.userInputs = action.payload;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(fetchUserInputs.rejected, (state, action) => {
        state.userInputs = [];
        state.isLoading = false;
        state.error = action.error.message!;
      });
    builder
      .addCase(postUserInput.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(postUserInput.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(postUserInput.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
    builder
      .addCase(putUserInput.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(putUserInput.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(putUserInput.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
    builder
      .addCase(deleteUserInput.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(deleteUserInput.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
      })
      .addCase(deleteUserInput.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
});

const userInputReducer = userInputSlice.reducer;
export { fetchUserInputs, postUserInput, putUserInput, deleteUserInput };
export default userInputReducer;
