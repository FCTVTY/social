import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CommunityCollection,
  Post,
  Ads,
  Profile,
} from "../../interfaces/interfaces";
import { getApiDomain } from "../../lib/auth/supertokens";

interface CommunityState {
  community: Partial<CommunityCollection> | null;
  posts: Post[];
  ads: Ads[];
  profile: Profile | null;
  loading: boolean;
  skelloading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  community: null,
  posts: [],
  ads: [],
  profile: null,
  loading: false,
  skelloading: true,
  error: null,
};

// Async thunks for fetching community data
export const fetchCommunityDetails = createAsyncThunk(
  "community/fetchCommunityDetails",
  async ({
    host,
    channel,
    page,
  }: {
    host: string;
    channel: string;
    page: number;
  }) => {
    const communityResponse = await axios.get(
      `${getApiDomain()}/community?name=${host}`,
    );
    const communityData: CommunityCollection = communityResponse.data;

    const [postsResponse, adsResponse, profileResponse] = await Promise.all([
      axios.get(
        `${getApiDomain()}/community/posts?oid=${host}&name=${channel}&page=${page}`,
      ),
      axios.get(`${getApiDomain()}/data/get`),
      axios.get(`${getApiDomain()}/profile`),
    ]);

    return {
      community: communityData,
      posts: postsResponse.data,
      ads: adsResponse.data,
      profile: profileResponse.data,
    };
  },
);

export const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setPage(state, action) {
      // Optionally manage page state here
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityDetails.pending, (state) => {
        state.skelloading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityDetails.fulfilled, (state, action) => {
        state.community = action.payload.community;
        state.posts = action.payload.posts;
        state.ads = action.payload.ads;
        state.profile = action.payload.profile;
        state.skelloading = false;
        state.loading = false;
      })
      .addCase(fetchCommunityDetails.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to load community details";
        state.skelloading = false;
        state.loading = false;
      });
  },
});

export const { setPage, setLoading } = communitySlice.actions;
export default communitySlice.reducer;
