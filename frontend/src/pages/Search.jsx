import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineSearch } from "react-icons/md";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { setSearchData } from "../redux/userSlice";
import { serverUrl } from "../App";

const DEFAULT_DP = "https://via.placeholder.com/150?text=profile";

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchData } = useSelector((state) => state.user);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // debounced search + cancellation
  useEffect(() => {
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${serverUrl}/api/user/search`, {
          signal,
          params: { keyword: input },
          withCredentials: true,
        });

        dispatch(setSearchData(res.data || []));
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(err);
          setError("Failed to fetch");
          dispatch(setSearchData([]));
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [input, dispatch]);

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div className="w-full min-h-[100vh] bg-black pt-[19px] flex items-center flex-col gap-[19px]">
      {/* Header */}
      <div className="w-full flex h-[80px] sticky top-0 left-0 items-center gap-[19px] px-[19px] bg-black z-50">
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
      </div>

      {/* Search bar */}
      <div className="w-full h-[80px] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[90%] px-[20px] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center"
        >
          <MdOutlineSearch className="text-white h-[22px] w-[22px]" />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="text-white w-full h-full outline-0 rounded-full px-[20px] bg-transparent"
            placeholder="Search..."
          />
        </form>
      </div>

      {/* Status text */}
      <div className="w-[90%] max-w-[700px]">
        {loading && <div className="text-white">Searching...</div>}
        {error && <div className="text-red-400">{error}</div>}
      </div>

      {/* Search results */}
      <div className="w-full flex flex-col items-center gap-3 pb-8">
        {Array.isArray(searchData) && searchData.length > 0 ? (
          searchData.map((user) => {
            const key = user._id ?? user.username ?? Math.random();

            return (
              <div
                key={key}
                className="w-[90vw] cursor-pointer max-w-[700px] h-[80px] rounded-full bg-white flex items-center gap-[20px] px-[20px]"
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                {/* Profile image */}
                <div className="w-[40px] h-[40px] border-2 border-black rounded-full overflow-hidden">
                  <img
                    src={user.profileImage || DEFAULT_DP}
                    alt={`${user.username}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name and username */}
                <div className="text-black text-[18px] font-semibold">
                  <div>{user.username}</div>
                  <div className="text-[14px] text-gray-400">{user.name}</div>
                </div>
              </div>
            );
          })
        ) : (
          !loading &&
          input.trim() && <div className="text-gray-300">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default Search;
