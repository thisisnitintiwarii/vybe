import { IoArrowBackSharp } from "react-icons/io5";
import FollowButton from "../components/FollowButton.jsx";
import axios from "axios";
import DP from "../assets/DP.png";
import React from "react";
import { serverUrl } from "../App.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice.js";
import { useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Post from "../components/Post.jsx";
import { setSelectedUser } from "../redux/messageSlice.js";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getProfile/${username}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const result = axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleProfile();
  }, [username, dispatch]);

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="text-white w-full h-[80px] justify-between flex items-center px-[30px]  ">
        <div onClick={() => navigate(`/`)} className="cursor-pointer">
          <IoArrowBackSharp className="text-white w-[25px] h-[25px]" />
        </div>
        <div className="font-semibold text-[20px] ">
          {profileData?.username}
        </div>
        <div
          onClick={handleLogout}
          className="font-semibold cursor-pointer text-[20px] text-blue-500"
        >
          Logout
        </div>
      </div>

      <div className="w-full h-[150px] flex justify-center items-center gap-[19px] lg:gap[50px] pt-[19px] px-[10px] ">
        <div className="w-[80px] h-[80px] md:h-[140px] md:w-[140px] border-black cursor-pointer overflow-hidden rounded-full">
          <img
            src={profileData?.profileImage || DP}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-[22px] text-white">
            {profileData?.name}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">{profileData?.bio}</div>
        </div>
      </div>

      {/* followers Section*/}
      <div className="text-white w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[10%] pt-[30px] ">
        <div>
          <div className="text-white text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts.length}
          </div>
          <div className="text-[18px] md:text-[22px]">Posts</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
              {/* {profileData?.followers.slice(0, 3).map((follower, index) => (
              <div className="w-[60px] h-[60px] md:h-[140px] md:w-[140px] border-black cursor-pointer overflow-hidden rounded-full">
                <img
                  src={profileData?.profileImage || DP}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
            ))} */}

              {profileData?.followers?.slice(0, 3).map((user, index) => (
                <div
                  className={`${
                    index > 0 ? `absolute left-[${index * 9}px]` : ""
                  }w-[40px] h-[40px]  border-black border-2 cursor-pointer overflow-hidden rounded-full`}
                  style={{ left: `${index * 9}px` }}
                >
                  <img
                    src={user?.profileImage || DP}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.followers.length}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px]">Followers</div>
        </div>
        <div>
          {/* <div>{profileData.following.length}</div> */}
          <div className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
              {/* {profileData?.followers.slice(0, 3).map((follower, index) => (
              <div className="w-[60px] h-[60px] md:h-[140px] md:w-[140px] border-black cursor-pointer overflow-hidden rounded-full">
                <img
                  src={profileData?.profileImage || DP}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
            ))} */}
              {profileData?.following?.slice(0, 3).map((user, index) => (
                <div
                  className={`${
                    index > 0 ? `absolute left-[${index * 9}px]` : ""
                  } w-[40px] h-[40px]  border-black border-2 cursor-pointer overflow-hidden rounded-full`}
                  style={{ left: `${index * 9}px` }}
                >
                  <img
                    src={user?.profileImage || DP}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.following.length}
            </div>
          </div>

          <div className="text-[18px] md:text-[22px]">Following</div>
        </div>
      </div>

      <div className=" mt-[10px] w-full h-[80px] flex justify-center items-center gap-[19px]">
        {profileData?._id == userData?._id && (
          <button
            onClick={() => navigate(`/editprofile`)}
            className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl "
          >
            Edit Profile
          </button>
        )}

        {profileData?._id != userData?._id && (
          <>
            <FollowButton
              targetuserId={profileData?._id}
              tailwind={
                "px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl "
              }
            />
            <button
              onClick={() => {
                dispatch(setSelectedUser(profileData));
                navigate("/chatting");
              }}
              className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl "
            >
              Message
            </button>
          </>
        )}
      </div>

      {/* post section */}

      <div className="w-full min-h-[100vh] flex  justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-2xl bg-white relative gap=[19px] pt-[30px] pb-[100px]">
          <Nav />
          {postData.map(
            (post, index) =>
              post.author?._id == profileData?._id && (
                <Post post={post} key={index} />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
