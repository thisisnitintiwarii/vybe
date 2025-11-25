import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ReciverMessage = ({ message }) => {
  const { userData } = useSelector((state) => state.user);
  const { profileData } = useSelector((state) => state.user);
  const { selectedUser, message: fullMessage } = useSelector(
    (state) => state.message
  );
  const scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behaviour: "smooth" }, [fullMessage]);
  });
  return (
    <div
      ref={scroll}
      className="w-fit max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-bl-2xl rounded-br-2xl px-[10px] py-[10px] relative mr-auto left-0 flex flex-col gap-[10px]"
    >
      {message.image && (
        <img
          src={message.image}
          alt=""
          className="h-[199px] object-cover rounded-2xl"
        />
      )}

      {message.message && (
        <div className="text-[19px] text-white wrap-break-word">
          {message.message}
        </div>
      )}
      <div className="w-[25px] h-[25px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-40px]">
        <img
          src={profileData?.profileImage}
          alt=""
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

export default ReciverMessage;
