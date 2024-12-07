import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SearchResult from "../../types/searchLocation/SearchResult";
import { getSearchLocationResultsRequest } from "./SearchLocationRequests";
import { RootState } from "../../app/store";

interface SearchLocationState {
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string;
  cache: Record<string, SearchResult[]>;
}

function getInitialSearchLocationState(): SearchLocationState {
  return {
    searchResults: [],
    isLoading: false,
    error: "",
    cache: {},
  };
}

const fetchSearchResults = createAsyncThunk<
  SearchResult[],
  string,
  { state: RootState }
>(
  "searchLocation/fetchSearchResults",
  async function get(
    countryName: string,
    { getState, dispatch }
  ): Promise<SearchResult[]> {
    const state = getState();
    const userInfo = state.auth.userInfo;

    if (userInfo === null) {
      return Promise.reject("User not logged in");
    }

    const cachedResults = state.searchLocation.cache[countryName.toLowerCase()];
    if (cachedResults) {
      return cachedResults;
    }

    const results = await getSearchLocationResultsRequest(
      userInfo.token,
      countryName
    );
    dispatch(
      cacheSearchResults({ searchTerm: countryName.toLowerCase(), results })
    );
    return results;
  }
);

const searchLocationSlice = createSlice({
  name: "searchLocation",
  initialState: getInitialSearchLocationState(),
  reducers: {
    cacheSearchResults: (
      state,
      action: { payload: { searchTerm: string; results: SearchResult[] } }
    ) => {
      state.cache[action.payload.searchTerm] = action.payload.results;
    },
    clearCache: (state) => {
      state.cache = {};
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "";
      });
  },
});

const { cacheSearchResults, clearCache } = searchLocationSlice.actions;
const searchLocationReducer = searchLocationSlice.reducer;
export { fetchSearchResults, clearCache };
export default searchLocationReducer;
