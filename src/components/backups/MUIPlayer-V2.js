import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Toolbar, IconButton, TextField, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import LoopIcon from '@mui/icons-material/Loop';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SpeedIcon from '@mui/icons-material/Speed';

const MUIPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopRange, setLoopRange] = useState([0, 0]);
  const [mediaSrc, setMediaSrc] = useState(null);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const mediaRef = useRef(null);
  const fileInputRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (mediaRef.current) {
      const duration = mediaRef.current.duration;
      setLoopRange([0, duration]);
    }
  }, [mediaSrc]);

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
      setLoopRange([currentTime, loopRange[1]]);
    }
  };

  const setEnd = () => {
    if (mediaRef.current) {
      const currentTime = mediaRef.current.currentTime;
      setLoopRange([loopRange[0], currentTime]);
    }
  };

  const handleSpeedChange = (event, newValue) => {
    const speed = newValue / 100; // Convert percentage to a decimal (20% to 1.2)
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
    const newSpeed = Number(event.target.value) / 100; // Convert to decimal
    if (newSpeed >= 0.2 && newSpeed <= 1.2) {
      setPlaybackSpeed(newSpeed); // Update playback speed state
      if (mediaRef.current) mediaRef.current.playbackRate = newSpeed; // Set media playback rate
    }
  }

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
        </Box>

       {/* New Row for Speed Control */}
   


<Box sx={{ width: '100%', display: 'flex', alignItems: 'center', paddingX: 1 }}>
  <SpeedIcon sx={{ marginRight: 1, fontSize: 20 }} /> {/* Speed icon as label */}
  
  <Slider
    value={Math.round(playbackSpeed * 100)} // Convert to integer percentage
    onChange={handleSpeedChange}
    size="small"
    min={20}
    max={120}
    step={1}
    aria-labelledby="playback-speed-slider"
    valueLabelDisplay="auto"
    valueLabelFormat={(value) => `${value}%`} // Display integer value with % sign
    sx={{
      flexGrow: 1,
      maxWidth: '70%', // Reduce width to avoid pushing the input field too far
      marginRight: 1
    }}
  />
  
  <TextField
    value={Math.round(playbackSpeed * 100)} // Display integer value
    onChange={handleSpeedInputChange}
    type="number"
    size="small"
    sx={{
      width: 60, // Ensure it matches start and end input sizes
      '& .MuiInputBase-input': { fontSize: 12, padding: '6px' }
    }}
  />
</Box>



      </Toolbar>
    </Card>
  );
};

export default MUIPlayer;
