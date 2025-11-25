import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";

const VideoPlayer = ({ media }) => {
  const videoTag = useRef();

  const [mute, setMute] = useState(false);
  const [play, setPlay] = useState(true);

  const handleClick = () => {
    if (play) {
      videoTag.current.pause();
      setPlay(false);
    } else {
      videoTag.current.play();
      setPlay(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoTag.current;
        if (entry.isIntersecting) {
          video.play();
          setPlay(true);
        } else {
          video.pause();
          setPlay(false);
        }
      },
      { threshold: 0.6 }
    );
    if (videoTag.current) {
      observer.observe(videoTag.current);
    }

    return () => {
      if (videoTag.current) {
        observer.unobserve(videoTag.current);
      }
    };
  }, []);

  return (
    <div className="h-[100% relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        ref={videoTag}
        src={media}
        autoPlay
        muted={mute}
        onClick={handleClick}
        className="h-[100%] cursor-pointer w-full object-cover rounded-2xl"
      ></video>
      <div className="absolute text-white bottom-[10px] tight-[10px] ">
        {!mute ? (
          <FaVolumeMute
            onClick={() => setMute((m) => !m)}
            className="w-[19px] h-[9px] text-white font-semibold"
          />
        ) : (
          <FaVolumeUp
            className="w-[19px] h-[9px] text-white font-semibold"
            onClick={() => setMute((m) => !m)}
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
