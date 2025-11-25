import React, { useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import DP from "../assets/DP.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setUserData, setProfileData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData, profil } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const imageInput = useRef();
  const [frontEndImage, setFrontEndImage] = useState(
    userData?.profileImage || DP
  );
  const [backendImage, setBackendImage] = useState();

  const [name, setName] = useState(userData?.name || "");
  const [username, setUsername] = useState(userData?.username || "");
  const [bio, setBio] = useState(userData?.bio || "");
  const [profession, setProfession] = useState(userData?.profession || "");
  const [gender, setGender] = useState(userData?.gender || "");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("profession", profession);
      formData.append("gender", gender);
      if (backendImage) {
        formData.append("profileImage", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/editProfile`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(result);
      dispatch(setProfileData(result.data));
      dispatch(setUserData(result.data));
      navigate(`/profile/${userData?.username}`);
    } catch (error) {
      console.log("Edit profile Error", error);
    } finally {
      setLoading(true);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setBackendImage(file);

    setFrontEndImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full min-h-[100vh] bg-black pt-[19px] flex items-center flex-col gap-[19px]">
      <div className="w-full flex h-[80px] fixed left-[19px] items-center gap-[19px] px-[19px] ">
        <IoArrowBackSharp
          onClick={() => navigate(`/profile/${userData.username}`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
        <h1 className="text-white text-[19px] font-semibold">Edit Profile</h1>
      </div>
      <div
        className="w-[80px] mt-[40px] h-[80px] md:h-[140px] md:w-[140px] border-black cursor-pointer overflow-hidden rounded-full"
        onClick={() => imageInput.current.click()}
      >
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={handleImage}
        />
        <img src={frontEndImage} alt="" className="w-full object-cover" />
      </div>

      <div
        className="text-blue-500 text-center text-[19px] cursor-pointer font-semibold"
        onClick={() => imageInput.current.click()}
      >
        Change Your Profile Picture
      </div>

      <input
        type="text"
        name=""
        id=""
        className="w-[90%] text-white max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[19px] outline-none "
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        type="text"
        name=""
        id=""
        className="w-[90%] text-white max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[19px] outline-none "
        placeholder="Enter Your UserName"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="text"
        name=""
        id=""
        className="w-[90%] text-white max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[19px] outline-none "
        placeholder="Enter Your Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
      />
      <input
        type="text"
        name=""
        id=""
        className="w-[90%] text-white max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[19px] outline-none "
        placeholder="Enter Your Profession"
        onChange={(e) => setProfession(e.target.value)}
        value={profession}
      />
      <input
        type="text"
        name=""
        id=""
        className="w-[90%] text-white max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[19px] outline-none "
        placeholder="Enter Your Gender"
        onChange={(e) => setGender(e.target.value)}
        value={gender}
      />

      <button
        onClick={handleSubmit}
        className="px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl"
      >
        {loading ? <ClipLoader size={30} color="black" /> : "Save Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
