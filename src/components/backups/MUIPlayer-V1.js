import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Toolbar, IconButton, TextField, Slider, Typography, SpeedDial, SpeedDialAction } from '@mui/material';
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

  const speedOptions = [0.5, 1, 1.5, 2];

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

  const handleSpeedChange = (speed) => {
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

  return (
    <Card sx={{ width: 400, bgcolor: 'background.paper', boxShadow: 4, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, padding: 0 }}>
        {/* Media Player Section */}
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

      {/* Toolbar at the bottom of the Card */}
      <Toolbar sx={{ justifyContent: 'space-between', flexDirection: 'column', bgcolor: 'background.default', padding: 0 }}>
        {/* Progress Slider with Loop Range Overlay */}
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

        {/* Control buttons and loop range */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingX: 1, gap: 1, position: 'relative' }}>
          {/* File Open Button */}
          <input
            type="file"
            accept="video/*,audio/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <IconButton color="primary" onClick={handleOpenFile}>
            <FolderOpenIcon fontSize="small" />
          </IconButton>

          {/* Play/Stop button */}
          <IconButton onClick={togglePlay} color="primary">
            {isPlaying ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>

          {/* Loop button */}
          <IconButton onClick={toggleLoop} color={loopEnabled ? "secondary" : "default"}>
            <LoopIcon fontSize="small" />
          </IconButton>

          {/* Set Start button */}
          <IconButton onClick={setStart}>
            <span>[</span>
          </IconButton>

          {/* Set End button */}
          <IconButton onClick={setEnd}>
            <span>]</span>
          </IconButton>

          {/* Loop Start and Stop input fields in mm:ss format */}
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

          {/* Speed Dial for Playback Speed */}
          <Box sx={{ position: 'relative' }}>
            <SpeedDial
              ariaLabel="SpeedDial playback speeds"
              icon={<SpeedIcon />}
              direction="up"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                '& .MuiSpeedDial-fab': {
                  width: 36,
                  height: 36,
                },
              }}
            >
              {speedOptions.map((speed) => (
                <SpeedDialAction
                  key={speed}
                  icon={<Typography variant="body2">{speed}x</Typography>}
                  tooltipTitle={`${speed}x`}
                  onClick={() => handleSpeedChange(speed)}
                />
              ))}
            </SpeedDial>
          </Box>
        </Box>
      </Toolbar>
    </Card>
  );
};

export default MUIPlayer;
