// MomentList.js
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Moment from './Moment';
import { useMediaContext } from './useMediaContext'; // This context will hold the media details from MUIPlayer

const MomentList = () => {

    const {
        setLoopRange,
        setPlaybackSpeed,
        setIsPlaying,
        setMediaSrc,
      } = useMediaContext(); // Destructure the necessary state and functions from context


  const [moments, setMoments] = useState([]);
  const { getCurrentMomentDetails } = useMediaContext(); // Function to get current player details

  const handleSaveMoment = () => {
    const momentDetails = getCurrentMomentDetails(); // Fetch details from MUIPlayer
    if (momentDetails) {
      setMoments((prevMoments) => [...prevMoments, momentDetails]);
    }
  };

  const handleDeleteMoment = (index) => {
    setMoments((prevMoments) => prevMoments.filter((_, i) => i !== index));
  };

  const handleSelectMoment = (moment) => {
  //  setMediaSrc('path/to/media/file'); // Set your media source here
    setLoopRange([moment.start, moment.stop]);
    setPlaybackSpeed(moment.speed);
    setIsPlaying(true); // Automatically play if needed
    console.log(handleDeleteMoment);
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleSaveMoment}>
        Save Moment
      </Button>
      <Box mt={2}>
        {moments.map((moment, index) => (
          <Moment
            key={index}
            initialName ={`Moment ${index + 1}`}
            start={moment.start}
            stop={moment.stop}
            speed={moment.speed}
            onDelete={() => handleDeleteMoment(index)}
            onSelect={() => handleSelectMoment(moment)} // Pass the entire moment object
          />
        ))}
      </Box>
    </Box>
  );
};

export default MomentList;
