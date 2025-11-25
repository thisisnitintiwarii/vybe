import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-black flex flex-col items-center">
      <div className="w-full flex h-[80px] fixed left-[19px] items-center gap-[19px] px-[19px] ">
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
        <h1 className="text-white text-[19px] font-semibold">Upload Media</h1>
      </div>

      <div className="w-[80%] max-w-[600px] h-[80px] bg-[white] rounded-full flex justify-around items-center gap-[10px]">
        <div className="w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black">
          Post
        </div>
        <div className="w-[28%] h-[80%] flex justify-center items-center text-[19px] cursor-pointer">
          Story
        </div>
        <div className="w-[28%] h-[80%] flex justify-center items-center text-[19px] cursor-pointer">
          Loop
        </div>
      </div>
    </div>
  );
};

export default Upload;
