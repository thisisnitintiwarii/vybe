import { IoMdSend } from "react-icons/io";
import { GoHeartFill } from "react-icons/go";
import { FiHeart } from "react-icons/fi";
import { MdOutlineComment } from "react-icons/md";
import { IoVolumeHigh } from "react-icons/io5";
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import DP from "../assets/DP.png";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App.jsx";
import { useNavigate } from "react-router-dom";
import { setLoopData } from "../redux/loopSlice.js";

const LoopCard = ({ loop }) => {
  const videoRef = useRef();
  const commentRef = useRef();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
  const [showHeart, SetShowHeart] = useState(false);
  const [showCommnet, setShowComment] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      let percentCount = video.currentTime / video.duration;
      percentCount *= 100;

      setProgress(percentCount);
    }
  };

  const handleLikeDouble = () => {
    SetShowHeart(true);
    setTimeout(() => SetShowHeart(false), 3000);
    {
      loop?.likes?.includes(userData?._id) == false && handleLike();
    }
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, {
        withCredentials: true,
      });

      const updatedLoop = result.data;

      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p
      );

      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message: message },
        {
          withCredentials: true,
        }
      );

      setMessage("");

      const updatedLoop = result.data;

      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p
      );

      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      {
        if (commentRef.current && !commentRef.current.contains(e.target)) {
          setShowComment(false);
        }
      }
    };

    if (showCommnet) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCommnet]);

  return (
    <div className="w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden">
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50">
          <GoHeartFill className="w-[100px] drop-shadow-2xl h-[100px] text-white" />
        </div>
      )}

      <div
        ref={commentRef}
        className={`absolute z-[199] transition-transform duration-500 ease-in-out bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] left-0 ${
          showCommnet ? "translate-y-0" : "translate-y-[100%]"
        }`}
      >
        <h1 className="text-white text-[19px] text-center font-semibold">
          Comments
        </h1>
        <div className="w-full h-[350px] overflow-auto flex flex-col gap-[19px]">
          {loop.comments?.length == 0 && (
            <div className="text-center text-white font-semibold mt-[50px] text-[19px]">
              No Comments yet
            </div>
          )}
          {loop.comments.map((com, index) => (
            <div
              className="w-full flex  justify-start  gap-[-5px] border-b-[1px] border-gray-800 pb-[10px]"
              key={index}
            >
              <div className="w-[25px] mt-[5px] h-[25px] border-black cursor-pointer overflow-hidden rounded-full">
                <img
                  src={com?.author?.profileImage || DP}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
              <div className="px-[10px]">
                <div className=" text-gray-300">{userData?.username}</div>
                <div className="text-white text-[15px]">{com.message}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full fixed bottom-0 h-[80px] flex items-center justify-between  py-[19px] ">
          <div className="w-[30px] h-[30px] border-black cursor-pointer overflow-hidden rounded-full">
            <img
              src={userData?.profileImage || DP}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <input
            className="px-[10px] border-b-2 border-b-gray-500 w-[90%] text-white outline-none h-[40px]  "
            placeholder="Write comments...."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          {message.length > 0 && (
            <button
              onClick={handleComment}
              className="cursor-pointer absolute right-[19px]"
            >
              <IoMdSend className=" text-white w-[25px] h-[25px]" />
            </button>
          )}
        </div>
      </div>

      <video
        ref={videoRef}
        src={loop?.media}
        className="w-full max-h-[100vh]"
        autoPlay
        loop
        muted={isMute}
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeDouble}
      />
      <div
        className="absolute top-[19px] z-[100] cursor-pointer right-[19px]"
        onClick={() => setIsMute((m) => !m)}
      >
        {!isMute ? (
          <IoMdVolumeHigh className="w-[19px] h-[19px] text-white  cursor-pointer font-semibold" />
        ) : (
          <IoMdVolumeOff className="w-[19px] h-[19px] text-white cursor-pointer font-semibold" />
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gray-900 ">
        <div
          className="w-[199px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="absolute w-full h-[100px] bottom-[10px] px-[15px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[30px] h-[30px] border-black cursor-pointer overflow-hidden rounded-full">
            <img
              src={loop?.author?.profileImage || DP}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className="w-[119px] font-semibold text-white truncate">
            {loop?.author?.username}
          </div>
          {loop?.author._id != userData?._id && (
            <FollowButton
              targetuserId={loop?.author?._id}
              tailwind={
                "px[5px] w-fit cursor-pointer gap-[10px] rounded-2xl py-[5px] text-white border-2 border-white"
              }
            />
          )}
        </div>
        <div className="text-white px-[10px]">{loop.caption}</div>
        <div className="absolute right-0 flex flex-col gap-[19px] text-white bottom-[119px] justify-center px-[10px]">
          <div className="flex flex-col items-center cursor-pointer">
            <div onClick={handleLike}>
              {!loop?.likes?.includes(userData._id) ? (
                <FiHeart className="w-[25px] h-[25px] cursor-pointer" />
              ) : (
                <GoHeartFill className="w-[25px] h-[25px] cursor-pointer text-red-600" />
              )}
            </div>
            <div>{loop?.likes?.length}</div>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <div onClick={() => setShowComment(true)}>
              <MdOutlineComment className="w-[25px] h-[25px] cursor-pointer" />
            </div>
            <div>{loop?.comments?.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopCard;
