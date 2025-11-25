import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice.js";
import { setFollowing } from "../redux/userSlice.js";

const getFollowingList = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/followingList`, {
          withCredentials: true,
        });
        dispatch(setFollowing(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [dispatch, userData]);
};

export default getFollowingList;
