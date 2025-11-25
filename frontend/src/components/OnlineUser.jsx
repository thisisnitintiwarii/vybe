import React from "react";
import DP from "../assets/DP.png";
import { setSelectedUser } from "../redux/messageSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const OnlineUser = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="w-[60px] h-[60px] gap-[19px] justify-center items-center relative">
      <div
        onClick={() => {
          dispatch(setSelectedUser(user));

          navigate(`/chatting`);
        }}
        className="w-[50px] h-[50px] border-black cursor-pointer overflow-hidden rounded-full"
      >
        <img
          src={user.profileImage || DP}
          alt=""
          className="w-full object-cover"
        />
      </div>
      <div className="w-[10px] h-[10px] bg-[#0080ff] rounded-full absolute top-2 right-0"></div>
    </div>
  );
};

export default OnlineUser;
