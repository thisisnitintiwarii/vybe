import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setStoryList } from "../redux/storySlice.js";

const getAllStories = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/story/getMyFriends`, {
          withCredentials: true,
        });

        dispatch(setStoryList(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchLoops();
  }, [dispatch, userData]);
};

export default getAllStories;
