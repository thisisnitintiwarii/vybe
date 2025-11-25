import React from "react";
import { serverUrl } from "../App.jsx";
import axios from "axios";
import { toggleFollow } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const FollowButton = ({ targetuserId, tailwind }) => {
  const dispatch = useDispatch();
  const { following } = useSelector((state) => state.user);

  const isFollowing = following.includes(targetuserId);

  const handleFollow = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/follow/${targetuserId}`,
        {
          withCredentials: true,
        }
      );
      dispatch(toggleFollow(targetuserId));
    } catch (error) {
      console.log("follow button error");
    }
  };
  return (
    <button className={tailwind} onClick={handleFollow}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
