import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Card, CardContent } from '@mui/material';
import MUIPlayer from './components/MUIPlayer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Card sx={{ width: 400, bgcolor: 'background.paper', boxShadow: 4 }}>
        
            <MUIPlayer />
       
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default App;
