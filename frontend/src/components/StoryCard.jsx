import { FiPlusCircle } from "react-icons/fi";
import React from "react";
import DP from "../assets/DP.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StoryCard = ({ ProfileImage, username, story }) => {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  const handleClick = () => {
    if (story && username == "Your Story") {
      navigate(`/story/${userData.username}`);
    } else if (story) {
      navigate(`/story/${username}`);
    }
  };

  return (
    <div className="flex flex-col w-[80px]">
      <div
        className={`w-[80px] h-[80px] ${
          story != null ? "bg-gradient-to-b from-green-400 to-green-800 " : ""
        }  rounded-full flex
     justify-center items-center relative`}
      >
        <div
          className="w-[70px] h-[70px] border-black cursor-pointer overflow-hidden rounded-full"
          onClick={handleClick}
        >
          <img src={ProfileImage} alt="" className="w-full object-cover" />
        </div>
      </div>
      <div className="text-[14px] truncate text-center text-[white] w-full">
        {username}
      </div>
    </div>
  );
};

export default StoryCard;
