import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, setUserData } from "../redux/userSlice";
import { setStoryData } from "../redux/storySlice";
import { setPrevChatsUsers } from "../redux/messageSlice";

const getPrevChatUsers = () => {
  const dispatch = useDispatch();

  const { message } = useSelector((state) => state.message);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/getAllPreviousChats`, {
          withCredentials: true,
        });

        dispatch(setPrevChatsUsers(result.data));

      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [message]);
};

export default getPrevChatUsers;
