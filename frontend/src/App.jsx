import React from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Routes, Route, Navigate } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import { useDispatch, useSelector } from "react-redux";
import getCurrentUser from "./hooks/getCurrentUser.js";
import getSuggestedUsers from "./hooks/getSuggestedUser.js";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Upload from "./pages/Upload.jsx";
import MediaUpload from "./pages/MediaUpload.jsx";
import getAllPost from "./hooks/getAllPost.js";
import Loops from "./pages/Loops.jsx";
import getAllLoops from "./hooks/getAllLoops.js";
import Story from "./pages/story.jsx";
import getAllStories from "./hooks/getAllStories.js";
import Messages from "./pages/Messages.jsx";
import MessagePage from "./pages/MessagePage.jsx";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { setOnlineUseers, setsocketData } from "./redux/socketSlice.js";
import getFollowingList from "./hooks/getFollowingList.jsx";
import getPrevChatUsers from "./hooks/getPrevChatUsers.js";
import Search from "./pages/Search.jsx";
export const serverUrl = "https://vybebackend-dnik.onrender.com";

const App = () => {
  // for accesssing the data from the user
  getCurrentUser();
  getAllPost();
  getAllStories();
  getSuggestedUsers();
  getFollowingList();
  getAllLoops();
  getPrevChatUsers();
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userData) {
      const socketIo = io(serverUrl, {
        query: {
          userId: userData._id,
        },
      });
      dispatch(setsocketData(socketIo));

      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUseers(users));
      });

      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setsocketData(null));
      }
    }
  }, [userData]);
  return (
    <Routes>
      <Route
        path="/signin"
        element={userData ? <Navigate to={"/"} /> : <SignIn />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/forgot-password"
        element={userData ? <Navigate to={"/"} /> : <ForgotPassword />}
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to={"/"} /> : <SignUp />}
      />
      <Route
        path="/profile/:username"
        element={userData ? <Profile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/editprofile"
        element={userData ? <EditProfile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/search"
        element={userData ? <Search /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/message"
        element={userData ? <Messages /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/chatting"
        element={userData ? <MessagePage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/upload"
        element={userData ? <MediaUpload /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/loops"
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/story/:username"
        element={userData ? <Story /> : <Navigate to={"/signin"} />}
      />
    </Routes>
  );
};

export default App;
