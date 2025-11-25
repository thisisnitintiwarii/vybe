import React from "react";
import { IoMdHome } from "react-icons/io";
import { MdOutlineSearch } from "react-icons/md";
import { TbBrandYoutube } from "react-icons/tb";
import DP from "../assets/DP.png";

import { FaRegSquarePlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  return (
    <div className="w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[19px] rounded-full shadow-2xl shadow-[#000000] z-[100] ">
      <div onClick={() => navigate(`/`)} className="cursor-pointer">
        <IoMdHome className="text-white h-[25px] w-[25px]" />
      </div>
      <div className="cursor-pointer" onClick={() => navigate(`/search`)}>
        <MdOutlineSearch className="text-white h-[25px] w-[25px]" />
      </div> 

      <div onClick={() => navigate(`/upload`)} className="cursor-pointer">
        <FaRegSquarePlus className="text-white h-[25px] w-[25px]" />
      </div>
      <div className="cursor-pointer" onClick={() => navigate(`/loops`)}>
        <TbBrandYoutube className="text-white h-[25px] w-[25px]" />
      </div>
      <div>
        <div
          onClick={() => navigate(`/profile/${userData.username}`)}
          className="w-[40px] h-[40px] border-black cursor-pointer overflow-hidden rounded-full"
        >
          <img
            src={userData?.profileImage || DP}
            alt=""
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Nav;
