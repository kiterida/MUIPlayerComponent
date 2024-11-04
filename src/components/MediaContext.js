// MediaContext.js
import React, { createContext, useState, useRef, useEffect } from 'react';

export const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopRange, setLoopRange] = useState([0, 0]);
  const [mediaSrc, setMediaSrc] = useState(null);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentMomentDetails, setCurrentMomentDetails] = useState({
    name: "",
    start: 0,
    stop: 0,
    speed: 1,
    mediaSrc: null, // Initialize with null or default value
  });
  const mediaRef = useRef(null);

  useEffect(() => {
    if (mediaRef.current) {
      const duration = mediaRef.current.duration;
      setLoopRange([0, duration]);
    }
  }, [mediaSrc]);

  const getCurrentMomentDetails = () => {
    return {
      name: "Current Moment",
      start: loopRange[0],
      stop: loopRange[1],
      speed: playbackSpeed,
    };
  };

  return (
    <MediaContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        loopEnabled,
        setLoopEnabled,
        loopRange,
        setLoopRange,
        mediaSrc,
        setMediaSrc,
        progress,
        setProgress,
        playbackSpeed,
        setPlaybackSpeed,
        mediaRef,
        getCurrentMomentDetails,
        currentMomentDetails,
        setCurrentMomentDetails, // Add this line
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
