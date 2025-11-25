import React from "react";
import LeftHome from "../components/LeftHome.jsx";
import Feed from "../components/Feed.jsx";
import RightHome from "../components/RightHome.jsx";

function Home() {
  return (
    <div className="w-full flex justify-center items-start">
      <LeftHome />
      <Feed />
      <RightHome />
    </div>
  );
}

export default Home;
