import React, { useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaRegSquarePlus } from "react-icons/fa6";
import axios from "axios";
import { setPostData } from "../redux/postSlice.js";
import { setStoryData } from "../redux/storySlice.js";
import { setLoopData } from "../redux/loopSlice.js";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { setUserData } from "../redux/userSlice.js";

const MediaUpload = () => {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState("post");
  const mediaInput = useRef();
  const [fmedia, setFMedia] = useState();
  const [bmedia, setBMedia] = useState();
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");

  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);
  const { storyData } = useSelector((state) => state.story);
  const [loading, setLoading] = useState(false);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      setMediaType("video");
    }
    setBMedia(file);
    setFMedia(URL.createObjectURL(file));
  };

  //upload post

  const uploadPost = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", bmedia);
      const result = await axios.post(
        `${serverUrl}/api/post/upload`,
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setPostData([...postData, result.data]));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //upload story
  const uploadStory = async () => {
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", bmedia);
      const result = await axios.post(
        `${serverUrl}/api/story/upload`,
        formData,
        {
          withCredentials: true,
        }
      );
      // Keep only storyId in user data
      setUserData((prev) => ({ ...prev, story: result.data._id }));

      // Store full story in Redux
      dispatch(setStoryData(result.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //upload loop

  const uploadLoop = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", bmedia);
      const result = await axios.post(
        `${serverUrl}/api/loop/upload`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setLoopData([...loopData, result.data]));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //upload function acording to the selected otpion

  const handleUpload = () => {
    setLoading(true);
    if (uploadType === "story") {
      uploadStory();
    } else if (uploadType === "loop") {
      uploadLoop();
    } else {
      uploadPost();
    }
  };

  return (
    <div className="w-full h-[100vh] bg-black flex flex-col items-center">
      <div className="w-full flex h-[80px] fixed left-[19px] items-center gap-[19px] px-[19px] ">
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
        <h1 className="text-white text-[19px] font-semibold">Upload Media</h1>
      </div>

      <div className="w-[80%] mt-[70px] max-w-[600px] h-[80px] bg-[white] rounded-full flex justify-around items-center gap-[10px]">
        <div
          onClick={() => setUploadType("post")}
          className={` ${
            uploadType == "post"
              ? "bg-black text-white shadow-2xl shadow-black"
              : ""
          } w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
        >
          Post
        </div>
        <div
          onClick={() => setUploadType("story")}
          className={` ${
            uploadType == "story"
              ? "bg-black text-white shadow-2xl shadow-black"
              : ""
          } w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
        >
          Story
        </div>
        <div
          onClick={() => setUploadType("loop")}
          className={`${
            uploadType == "loop"
              ? "bg-black shadow-2xl text-white  shadow-black"
              : ""
          } w-[28%] h-[90%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
        >
          Loop
        </div>
      </div>

      {!fmedia && (
        <div
          onClick={() => mediaInput.current.click()}
          className="w-[80%] cursor-pointer max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[10px] rounded-2xl mt-[15vh] hover:bg-[#353a3d] "
        >
          <input
            type="file"
            accept={uploadType == "loop" ? "video/*" : ""}
            hidden
            ref={mediaInput}
            onChange={handleMedia}
          />
          <FaRegSquarePlus className="text-white h-[25px] w-[25px]" />
          <div className="text-white text-[19px] font-semibold">{`upload ${uploadType}`}</div>
        </div>
      )}
      {fmedia && (
        <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]">
          {mediaType === "image" && (
            <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]">
              <img
                className="h-[60%] rounded-2xl"
                src={fmedia}
                alt="SELECTED MEDIA"
              />
              {uploadType !== "story" && (
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  type="text"
                  className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[19px]"
                  placeholder="Write You Caption"
                />
              )}
            </div>
          )}
          {mediaType === "video" && (
            <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]">
              <VideoPlayer media={fmedia} />
              {uploadType !== "story" && (
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  type="text"
                  className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[19px]"
                  placeholder="Write You Caption"
                />
              )}
            </div>
          )}
        </div>
      )}
      {fmedia && (
        <button
          className="px-[10px] w-[60%] max-w-[400px] py-[5px] bg-white mt-[50px] cursor-pointer rounded-2xl"
          onClick={handleUpload}
        >
          {loading ? <ClipLoader /> : `upload ${uploadType}`}
        </button>
      )}
    </div>
  );
};

export default MediaUpload;
