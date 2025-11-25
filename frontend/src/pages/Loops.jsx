import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import LoopCard from "../components/LoopCard.jsx";
import { useSelector } from "react-redux";

const Loops = () => {
  const navigate = useNavigate();

  const { loopData } = useSelector((state) => state.loop);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center">
      <div className="w-full flex h-[80px] items-center gap-[19px] px-[19px] fixed top-[10px] left-[10px] z-[100]">
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
        <h1 className="text-white text-[19px] font-semibold">Loops</h1>
      </div>
      <div className="h-[100vh] overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {loopData.map((loop, index) => (
          <div key={index} className="h-screen snap-start">
            <LoopCard loop={loop} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loops;
