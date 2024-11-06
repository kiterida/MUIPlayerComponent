// App.js
import React from 'react';
import { MediaProvider } from './components/MediaContext';
import MUIPlayer from './components/MUIPlayer';
import MomentList from './components/MomentList';
import GuitarTabEditor from './components/GuitarTabEditor';



function App() {
  return (
    <MediaProvider>
      <div style={{ width:'100%', height: '1000px', display: 'flex', flexDirection: 'column' }}>
        <MUIPlayer />

        <MomentList />
      </div>
    </MediaProvider>
  );
}

export default App;
