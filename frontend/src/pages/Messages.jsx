import React, { useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import DP from "../assets/DP.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setUserData, setProfileData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";
import OnlineUser from "../components/OnlineUser";
import { setSelectedUser } from "../redux/messageSlice.js";
const Messages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector((state) => state.message);
  return (
    <div className="w-full min-h-[100vh] bg-black p-[10px] gap-[19px] flex flex-col">
      <div className="w-full flex h-[80px] left-[19px] items-center gap-[10px] px-[10px] ">
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[20px] h-[20px] lg:hidden  cursor-pointer"
        />
        <h1 className="text-white text-[19px] font-semibold">Messages</h1>
      </div>

      {/* //serachBar */}

      <div className="w-full h-[50px] flex justify-center overflow-x-auto border-b-gray-800">
        {userData.following.map(
          (user, index) =>
            onlineUsers.includes(user._id) && <OnlineUser user={user} />
        )}
      </div>

      <div className="w-full h-full overflow-auto pt-[10px] flex flex-col border-t-1 border-[#212020] gap-[19px]">
        {prevChatUsers.map((user, index) => (
          <div
            className="text-white cursor-pointer w-full flex border border-[#151515] items-center gap-[10px]"
            onClick={() => {
              dispatch(setSelectedUser(user));
              navigate("/chatting");
            }}
          >
            {onlineUsers?.includes(user?._id) ? (
              <OnlineUser user={user} />
            ) : (
              <div className="w-[50px] h-[50px] border-black border-2 cursor-pointer overflow-hidden rounded-full">
                <img
                  src={user.profileImage || DP}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col h-[70px]  justify-center">
              <div className="text-white text-[18px]  font-semibold">
                {user.username}
              </div>
              {onlineUsers?.includes(user?._id) && (
                <div className="text-blue-50 text-[15px] ">Active Now</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
