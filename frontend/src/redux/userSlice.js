import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUsers: null,
    profileData: null,
    following: [],
    searchData: null,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    toggleFollow: (state, action) => {
      const targetuserId = action.payload;
      if (state.following.includes(targetuserId)) {
        state.following = state.following.filter(
          (id) => id.toString() !== targetuserId.toString()
        );
      } else {
        state.following.push(targetuserId);
      }
    },
  },
});

export const {
  setUserData,
  setFollowing,
  setSuggestedUsers,
  setProfileData,
  toggleFollow,
  setSearchData,
} = userSlice.actions;
export default userSlice.reducer;
