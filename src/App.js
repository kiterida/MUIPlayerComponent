// App.js
import React from 'react';
import { MediaProvider } from './components/MediaContext';
import MUIPlayer from './components/MUIPlayer';
import MomentList from './components/MomentList';

function App() {
  return (
    <MediaProvider>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MUIPlayer />
        <MomentList />
      </div>
    </MediaProvider>
  );
}

export default App;
