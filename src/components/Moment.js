// Moment.js
import React, { useContext } from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { MediaContext } from './MediaContext'; // Adjust the path as needed
import  GuitarTabEditor  from './GuitarTabEditor';

const Moment = ({ name, start, stop, speed, onDelete }) => {
  const { setCurrentMomentDetails } = useContext(MediaContext);

  const handleClick = () => {
    console.log('settingmomentdetails');
    setCurrentMomentDetails({ name, start, stop, speed });
  };

  return (
    <Card sx={{ marginBottom: 2, padding: 1 }} onClick={handleClick}>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2">Start: {start}</Typography>
          <Typography variant="body2">Stop: {stop}</Typography>
          <Typography variant="body2">Speed: {speed}%</Typography>
        
        </Box>
        <GuitarTabEditor />
        <Button onClick={onDelete} color="error">Delete</Button>
      </CardContent>
    </Card>
  );
};

export default Moment;
