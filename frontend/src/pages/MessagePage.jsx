import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaRegImages } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import DP from "../assets/DP.png";
import { useNavigate } from "react-router-dom";
import SenderMessage from "../components/SenderMessage.jsx";
import { serverUrl } from "../App.jsx";
import { setMessages } from "../redux/messageSlice.js";
import ReciverMessage from "../components/ReciverMessage.jsx";

const MessagePage = () => {
  const { selectedUser, message } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const imageInput = useRef();
  const navigate = useNavigate();

  const [input, setInput] = useState("");

  const [bImg, setBImg] = useState(null);
  const [fImg, setFImg] = useState(null);
  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setBImg(file);
    setFImg(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("message", input);
      if (bImg) {
        formData.append("image", bImg);
      }
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([...message, result.data]));
      setInput("");
      setFImg(null);
    } catch (error) {
      console.error("sendMessageError:", error.response?.data || error.message);
    }
  };

  const getAllMessages = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getAllMessages/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(result.data));
    } catch (error) {
      console.log("getAllMessages-Error");
    }
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...message, mess]));
    });
  }, [message, setMessages]);

  return (
    <div className="w-full h-[100vh] bg-black relative">
      <div className="w-full border-b-1 border-gray-900 flex items-center gap-[30px] px-[19px] py-[19px] fixed top-0 z-[100] bg-black">
        {/* Left: Back Arrow */}
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />

        {/* Right: Profile Image */}
        <div
          onClick={() => navigate(`/profile/${selectedUser.username}`)}
          className="w-[40px] h-[40px] cursor-pointer overflow-hidden rounded-full"
        >
          <img
            src={selectedUser?.profileImage || DP}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white text-[18px] font-semibold">
          <div>{selectedUser.name}</div>
          <div className="text-[14px] text-gray-400">
            {selectedUser.username}
          </div>
        </div>
      </div>

      <div className="w-full h-[80%] pt-[100px] pb-[119px] lg:pb-[150px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-black">
        {message &&
          message.map((msg, index) =>
            msg.sender == userData._id ? (
              <SenderMessage message={msg} />
            ) : (
              <ReciverMessage message={msg} />
            )
          )}
      </div>

      <div className="w-full h-[70px] flex fixed justify-center items-center bg-black z-[100] bottom-0 ">
        <form
          onSubmit={handleSendMessage}
          className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[19px] relative"
        >
          {fImg && (
            <div className="w-[150px] rounded-2xl h-[150px] absolute top-[-159px] right-[10px] overflow-hidden">
              <img src={fImg} alt="" className="h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="images/*"
            ref={imageInput}
            hidden
            onChange={handleImage}
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="message..."
            className="w-full h-full px-[19px] text-[18px] text-white outline-0"
          />

          <div onClick={() => imageInput.current.click()}>
            <FaRegImages className="w-[28px] cursor-pointer h-[28px] text-white " />
          </div>
          {(input || fImg) && (
            <button
              type="submit"
              className="w-[60px] cursor-pointer  h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center"
            >
              <IoMdSend />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessagePage;
