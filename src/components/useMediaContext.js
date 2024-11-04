// useMediaContext.js
import { useContext } from 'react';
import { MediaContext } from './MediaContext'; // Adjust the path as needed

export const useMediaContext = () => {
  return useContext(MediaContext);
};
