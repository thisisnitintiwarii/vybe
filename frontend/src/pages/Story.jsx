import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice.js";
import StoryComponent from "../components/StoryComponent.jsx";
import { useState } from "react";

const Story = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const [story, setStory] = useState(null);

  const handleStory = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getStory/${username}`,
        {
          withCredentials: true,
        }
      );
      setStory(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (username) {
      handleStory();
    }
  }, [username]);

  return (
    <div className="w-full h-[100vh] bg-black flex justify-center items-center">
      {story ? (
        <StoryComponent story={story} />
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
};

export default Story;
