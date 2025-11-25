import React from "react";
import DP from "../assets/DP.png";
import { IoArrowBackSharp } from "react-icons/io5";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { useState } from "react";
import { useEffect } from "react";

const StoryComponent = ({ story }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
      <div className="flex items-center gap-[10px] absolute top-[19px] ">
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
        <div className="w-[30px] h-[30px] border-black cursor-pointer overflow-hidden rounded-full">
          <img
            src={story.author.profileImage || DP}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div className="w-[119px] font-semibold text-white truncate">
          {story?.author?.username}
        </div>
      </div>

      {story?.mediaType === "image" && (
        <div className="w-full  h-[90vh] flex items-center justify-center">
          <img
            className="w-[80%] rounded-2xl object-cover"
            src={story?.media}
            alt="SELECTED MEDIA"
          />
        </div>
      )}
      {story?.mediaType === "video" && (
        <div className="w-[80%]  flex flex-col items-center justify-center">
          <VideoPlayer media={story?.media} />
        </div>
      )}
      <div className="absolute top-[10px] left-0 w-full h-[2.5px] bg-gray-900 ">
        <div
          className="w-[199px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StoryComponent;
