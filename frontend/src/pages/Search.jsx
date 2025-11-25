import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineSearch } from "react-icons/md";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { setSearchData } from "../redux/userSlice";
import { serverUrl } from "../App";

/**
 * Notes:
 * - Debounce: waits 300ms after typing stops before calling backend.
 * - Cancellation: abort previous request when a new one starts.
 * - No search on empty input (avoids unnecessary calls).
 * - Fixed header doesn't overlap input; used sticky + z-index.
 * - Provide a fallback `dp` image if user.profileImage is missing.
 */

const DEFAULT_DP = "https://via.placeholder.com/150?text=profile"; // replace with your actual default dp

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchData } = useSelector((state) => state.user);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // debounced search + cancellation using AbortController
  useEffect(() => {
    if (!input.trim()) {
      // if input empty, clear results
      dispatch(setSearchData([]));
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const handler = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        // NOTE: I changed query param to `keyword` (was `kewWord`).
        // If your backend expects `kewWord`, change back to that.
        const res = await axios.get(`${serverUrl}/api/user/search`, {
          signal,
          params: { keyword: input },
          withCredentials: true, // <-- required
        });
        console.log(res);
        dispatch(setSearchData(res.data || []));
      } catch (err) {
        if (axios.isCancel?.(err)) {
          // request canceled — ignore
        } else if (err.name === "CanceledError") {
          // axios v1.5+ uses CanceledError for AbortController
        } else {
          console.error(err);
          setError("Failed to fetch");
          dispatch(setSearchData([]));
        }
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    // cleanup: cancel axios and clear timeout
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [input, dispatch]);

  // optional: handle manual submit (if you want a search button)
  const handleSubmit = (e) => {
    e.preventDefault();
    // we already search via debounce; keep preventDefault to avoid page reload
  };

  return (
    <div className="w-full min-h-[100vh] bg-black pt-[19px] flex items-center flex-col gap-[19px]">
      {/* header: sticky so it won't overlap content; z-50 to stay on top */}
      <div className="w-full flex h-[80px] sticky top-0 left-0 items-center gap-[19px] px-[19px] bg-black z-50">
        <IoArrowBackSharp
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
      </div>

      {/* search bar */}
      <div className="w-full h-[80px] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[90%] px-[20px] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center"
          role="search"
        >
          <MdOutlineSearch className="text-white h-[22px] w-[22px]" />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="text-white w-full h-full outline-0 rounded-full px-[20px] bg-transparent"
            placeholder="Search..."
            aria-label="Search users"
          />
        </form>
      </div>

      {/* status */}
      <div className="w-[90%] max-w-[700px]">
        {loading && <div className="text-white">Searching...</div>}
        {error && <div className="text-red-400">{error}</div>}
      </div>

      {/* results */}
      <div className="w-full flex flex-col items-center gap-3 pb-8">
        {Array.isArray(searchData) && searchData.length > 0
          ? searchData.map((user) => {
              const key = user.id ?? user.userName ?? Math.random();
              return (
                <div
                  key={key}
                  onClick={() => navigate(`/profile/${user.username}`)}
                  className="w-[90vw] cursor-pointer max-w-[700px] h-[80px] rounded-full bg-white flex items-center gap-[20px] px-[20px]"
                >
                  {/* Profile Image */}
                  <div
                    className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/profile/${user.userName}`)}
                  >
                    <img
                      src={user.profileImage || DEFAULT_DP}
                      alt={`${user.userName}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name + Username */}
                  <div className="text-black text-[18px] font-semibold">
                    <div>{user.userName}</div>
                    <div className="text-[14px] text-gray-400">{user.name}</div>
                  </div>
                </div>
              );
            })
          : !loading &&
            input.trim().length > 0 && (
              <div className="text-gray-300">No users found.</div>
            )}
      </div>
    </div>
  );
};

export default Search;
