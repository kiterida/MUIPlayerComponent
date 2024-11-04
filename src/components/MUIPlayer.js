import React, { useEffect, useRef } from 'react';
import { Box, Card, CardContent, Toolbar, IconButton, TextField, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import LoopIcon from '@mui/icons-material/Loop';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SpeedIcon from '@mui/icons-material/Speed';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useMediaContext } from './useMediaContext'; // Adjust the import path accordingly

const MUIPlayer = () => {
  const {
    currentMomentDetails,
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
  } = useMediaContext();

  const fileInputRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {

    if (currentMomentDetails) {
      console.log("Moment details", currentMomentDetails);
      // Set the media source if necessary
      // if (mediaSrc !== currentMomentDetails.mediaSrc) {
      //   setMediaSrc(currentMomentDetails.mediaSrc); // Make sure to provide the correct media source
      // }

      if (mediaRef.current) {
        mediaRef.current.currentTime = currentMomentDetails.start; // Set the current time to the moment's start time
         mediaRef.current.playbackRate = currentMomentDetails.speed; // Assuming speed is in percentage
        setLoopRange([currentMomentDetails.start, currentMomentDetails.stop]); // Set the loop range

        // Optionally, set progress to start for any UI elements reflecting playback
        setProgress(currentMomentDetails.start);
        calculateLoopOverlay();        
        // Automatically play if desired
       // mediaRef.current.play();
      }
    }


    // if (currentMomentDetails) {
    //   console.log("moment details", currentMomentDetails);
    //   // Set the media source and playback details
    //   setMediaSrc(mediaSrc); // Set this to your media source
    //   if(mediaRef.current){
    //     mediaRef.current.currentTime = currentMomentDetails.start;
    //     mediaRef.current.playbackRate = currentMomentDetails.speed;
    //     setLoopRange([currentMomentDetails.start, currentMomentDetails.stop]);
    //   }
      
      // Logic to set the player state using currentMomentDetails
    

    if (mediaRef.current) {
      const duration = mediaRef.current.duration;
      // setLoopRange([0, duration]);
    }
  }, [mediaSrc, setLoopRange, currentMomentDetails]);


  const getCurrentMomentDetails = () => {
    return {
      name: "Current Moment", // You can modify this as necessary
      start: loopRange[0],
      stop: loopRange[1],
      speed: playbackSpeed,
    };
  };

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying((prev) => !prev);
    }
  };
  

  const toggleLoop = () => {
    setLoopEnabled((prev) => !prev);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setMediaSrc(fileURL);
      setIsPlaying(false);
    }
  };

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const handleMediaTimeUpdate = () => {
    if (mediaRef.current) {
      const currentTime = mediaRef.current.currentTime;
      const duration = mediaRef.current.duration;
      setProgress((currentTime / duration) * 100);

      if (loopEnabled && currentTime > loopRange[1]) {
        mediaRef.current.currentTime = loopRange[0];
      }
    }
  };

  const handleProgressSliderChange = (event, newValue) => {
    if (mediaRef.current) {
      const duration = mediaRef.current.duration;
      mediaRef.current.currentTime = (newValue / 100) * duration;
      setProgress(newValue);
    }
  };

  const setStart = () => {
    if (mediaRef.current) {
      const currentTime = mediaRef.current.currentTime;
      console.log("before", loopRange);
      setLoopRange([currentTime, loopRange[1]]);
      console.log("after", loopRange);
    }
  };

  const setEnd = () => {
    if (mediaRef.current) {
      const currentTime = mediaRef.current.currentTime;
      setLoopRange([loopRange[0], currentTime]);
      console.log("after", loopRange);
    }
  };

  const handleSpeedChange = (event, newValue) => {
    const speed = newValue / 100;
    setPlaybackSpeed(speed);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = speed;
    }
  };

  const calculateLoopOverlay = () => {
    if (mediaRef.current) {
      const duration = mediaRef.current.duration;
      const startPercent = (loopRange[0] / duration) * 100;
      const endPercent = (loopRange[1] / duration) * 100;
      return `linear-gradient(to right, transparent ${startPercent}%, yellow ${startPercent}%, yellow ${endPercent}%, transparent ${endPercent}%)`;
    }
    return 'transparent';
  };

  const handleSpeedInputChange = (event) => {
    const newSpeed = Number(event.target.value) / 100;
    if (newSpeed >= 0.2 && newSpeed <= 1.2) {
      setPlaybackSpeed(newSpeed);
      if (mediaRef.current) mediaRef.current.playbackRate = newSpeed;
    }
  };

  const jumpToStart = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = loopRange[0];
    }
  };

  const jumpToEnd = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = loopRange[1];
    }
  };

  return (
    <Card sx={{ width: 400, bgcolor: 'background.paper', boxShadow: 4, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, padding: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150, mb: 0 }}>
          {mediaSrc ? (
            <video
              ref={mediaRef}
              src={mediaSrc}
              style={{ width: '100%', height: 'auto', borderRadius: 4 }}
              onTimeUpdate={handleMediaTimeUpdate}
              onLoadedMetadata={() => {
                const duration = mediaRef.current.duration;
                setLoopRange([0, duration]);
              }}
            />
          ) : (
            <Typography variant="subtitle1" color="textSecondary">
              No media loaded
            </Typography>
          )}
        </Box>
      </CardContent>

      <Toolbar sx={{ display: 'flex', flexDirection: 'column', padding: 0, bgcolor: 'background.default' }}>
        <Box sx={{ width: '100%', paddingX: 1 }}>
          <Slider
            value={progress}
            onChange={handleProgressSliderChange}
            aria-labelledby="media-progress-slider"
            size="small"
            min={0}
            max={100}
            sx={{
              '& .MuiSlider-track': { display: 'none' },
              '& .MuiSlider-rail': {
                height: 8,
                backgroundImage: calculateLoopOverlay(),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingX: 1, gap: 1 }}>
          <input
            type="file"
            accept="video/*,audio/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <IconButton color="primary" onClick={handleOpenFile} size="small" sx={{ padding: 0.5 }}>
            <FolderOpenIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={togglePlay} color="primary" size="small" sx={{ padding: 0.5 }}>
            {isPlaying ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>

          <IconButton onClick={toggleLoop} color={loopEnabled ? "secondary" : "default"} size="small" sx={{ padding: 0.5 }}>
            <LoopIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={setStart} size="small" sx={{ padding: 0.5 }}>
            <span>[</span>
          </IconButton>

          <IconButton onClick={setEnd} size="small" sx={{ padding: 0.5 }}>
            <span>]</span>
          </IconButton>

          <TextField
            label="Start"
            type="text"
            value={formatTime(loopRange[0])}
            size="small"
            sx={{ width: 60, '& .MuiInputBase-input': { fontSize: 12, padding: '6px' } }}
          />
          <TextField
            label="Stop"
            type="text"
            value={formatTime(loopRange[1])}
            size="small"
            sx={{ width: 60, '& .MuiInputBase-input': { fontSize: 12, padding: '6px' } }}
          />

          <IconButton onClick={jumpToStart} size="small" sx={{ padding: 0.5 }}>
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={jumpToEnd} size="small" sx={{ padding: 0.5 }}>
            <SkipNextIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', paddingX: 1 }}>
          <SpeedIcon sx={{ marginRight: 1, fontSize: 20 }} />
          <Slider
            value={Math.round(playbackSpeed * 100)}
            onChange={handleSpeedChange}
            size="small"
            min={20}
            max={120}
            step={1}
            aria-labelledby="playback-speed-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value / 100}x`}
          />
          <TextField
            value={Math.round(playbackSpeed * 100)}
            onChange={handleSpeedInputChange}
            type="number"
            inputProps={{ min: 20, max: 120 }}
            size="small"
            sx={{ width: 50 }}
          />
        </Box>
      </Toolbar>
    </Card>
  );
};

export default MUIPlayer;
