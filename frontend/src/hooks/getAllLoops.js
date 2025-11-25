import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice.js";
import { setLoopData } from "../redux/loopSlice.js";

const getAllLoops = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/loop/getAllLoop`, {
          withCredentials: true,
        });
        dispatch(setLoopData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchLoops();
  }, [dispatch, userData]);
};

export default getAllLoops;
