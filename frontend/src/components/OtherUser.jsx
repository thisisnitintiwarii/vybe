import React from "react";
import { useSelector } from "react-redux";
import DP from "../assets/DP.png";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton.jsx";

const OtherUser = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[80px] flex items-center justify-between border-b-2 border-gray-900">
      <div className="flex items-center gap-[10px]">
        <div
          onClick={() => navigate(`/profile/${user.username}`)}
          className="w-[50px] h-[5s 0px] border-black cursor-pointer overflow-hidden rounded-full"
        >
          <img
            src={user.profileImage || DP}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div>
          <div className="text-[18px] text-white font-semibold">
            {user.username}
          </div>
          <div className="text-[18px] text-gray-400 font-semibold">
            {user.name}
          </div>
        </div>
      </div>
      <FollowButton
        tailwind={
          "px-[10px] w-[100px] py-[5px] h-[40px] bg-[white] rounded-2xl cursor-pointer"
        }
        targetuserId={user._id}
      />
    </div>
  );
};

export default OtherUser;
