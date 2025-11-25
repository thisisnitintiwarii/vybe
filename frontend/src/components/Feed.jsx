import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import StoryCard from "../components/StoryCard.jsx";
import logo from "../assets/logo.png";
import Nav from "./Nav.jsx";
import { useSelector } from "react-redux";
import Post from "./Post.jsx";
import DP from "../assets/DP.png";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const navigate = useNavigate();
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const { storyList } = useSelector((state) => state.story);
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-auto">
      <div className="w-full h-[100px] flex items-center justify-between p-[19px] lg:hidden">
        <img src={logo} alt="" className="w-[80px]" />
        <div className="flex flex-row gap-[15px] items-center">
          <FaRegHeart className="text-white w-[25px] h-[25px] cursor-pointer" />
          <MdOutlineMessage
            onClick={() => navigate("/message")}
            className="text-white w-[25px] h-[25px] cursor-pointer"
          />
        </div>
      </div>

      {/* //story  */}

      <div className="w-full flex overflow-auto gap-[19px] p-[19px]">
        <StoryCard
          username={userData.username}
          ProfileImage={userData.profileImage || DP}
          story={userData.story}
        />
        {storyList?.map((story, index) => (
          <StoryCard
            story={story}
            username={story.author.username}
            ProfileImage={story.author.profileImage}
            key={index}
          />
        ))}
      </div>

      {/* feed photo area */}
      <div className="w-full min-h-[100vh] flex flex-col items-center gap-[19px] p-[10px] pt-[40px] bg-white rounded-t-[40px] relative pb-[119px] ">
        <Nav />
        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
