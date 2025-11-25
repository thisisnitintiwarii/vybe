import React, { useState } from "react";
import blogo from "../assets/blogo.png";
import logo from "../assets/logo.png";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function SignUp() {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
  });

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState();
  const disptach = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          username,
          email,
          password,
        },
        { withCredentials: true }
      );

      disptach(setUserData(result.data));
    } catch (error) {
      setError(error.response?.data?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      <div className="w-[60%] lg:max-[60%] h-[600px] bg-white rounded-2xl mt-[50px] flex justify-center items-center overflow-hidden border-2 border-[#1a1f23] ">
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[19px]">
          <div className="flex gap-[10px] items-center text-[19px] font-semibold mt-[40px]">
            <span>SignUp to </span>
            <img src={blogo} alt="" className="w-[70px]" />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] mt-[40px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, name: true })}
          >
            <label
              htmlFor="name"
              className={`text-gray-700 absolute left-[19px] p-[5px] bg-white ${
                inputClicked.name ? "top-[-15px]" : ""
              }`}
            >
              {" "}
              Enter Your Name{" "}
            </label>
            <input
              type="text"
              id="name"
              className="w-[100%] h-[100%] rounded-2xl px-[19px] outline-none border-0"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, username: true })}
          >
            <label
              htmlFor="username"
              className={`text-gray-700 absolute left-[19px] p-[5px] bg-white ${
                inputClicked.username ? "top-[-15px]" : ""
              }`}
            >
              {" "}
              Enter Your username{" "}
            </label>
            <input
              type="text"
              id="username"
              className="w-[100%] h-[100%] rounded-2xl px-[19px] outline-none border-0"
              required
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              htmlFor="email"
              className={`text-gray-700 absolute left-[19px] p-[5px] bg-white ${
                inputClicked.email ? "top-[-15px]" : ""
              }`}
            >
              {" "}
              Enter Your email{" "}
            </label>
            <input
              type="email"
              id="email"
              className="w-[100%] h-[100%] rounded-2xl px-[19px] outline-none border-0"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, password: true })}
          >
            <label
              htmlFor="password"
              className={`text-gray-700 absolute left-[19px] p-[5px] bg-white ${
                inputClicked.password ? "top-[-15px]" : ""
              }`}
            >
              {" "}
              Enter Your Password{" "}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-[100%] h-[100%] rounded-2xl px-[19px] outline-none border-0"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {!showPassword ? (
              <IoMdEye
                className="absolute cursor-pointer right-[19px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <IoMdEyeOff
                className="absolute cursor-pointer right-[19px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>
          {err && <p className="text-red-600">{err}</p>}
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-[70%] px-[19px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
          </button>
          <p
            className="cursor-pointer text-gray-800"
            onClick={() => navigate("/signin")}
          >
            Already have an Account ?{" "}
            <span className="border-b-2 border-b-black pb-[3px] text-black ">
              Sign In
            </span>
          </p>
        </div>
        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
          <img src={logo} alt="VYBE" className="w-[40%]" />
          <p className="">VYBE | Not just a Platfrom, It's a Vybe </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
