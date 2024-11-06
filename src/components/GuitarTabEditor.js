import React, { useState, useEffect, useRef } from 'react';

const GuitarTabEditor = () => {
  const ref = useRef(null); // ref for the div container
  const apiRef = useRef(null); // ref for the AlphaTab API instance
  const [content, setContent] = useState(
    "\\staff 1.2 3.2 0.1 1.1 | 1.2 3.2 0.1 1.1 | 1.2 3.2 0.1 1.1 | 1.2 3.2 0.1 1.1 |"
  );

  useEffect(() => {
    // Initialize the AlphaTab API only once
    apiRef.current = new window.alphaTab.AlphaTabApi(ref.current, {
      core: {
        tex: true,
      },
      display: {
        staveProfile: "tab",
        layoutMode: "Horizontal",
      },
      notation: {
        elements: {
          scoreTitle: false,
          scoreWordsAndMusic: false,
          effectTempo: false,
          guitarTuning: false,
        },
      },
    });

    console.log("AlphaTab API initialized:", apiRef.current);

    // Event listener for when the user clicks on a beat (or any event to modify content)
    apiRef.current.beatMouseDown.on(() => {
      const newContent = `\\staff 1.2 3.2 0.1 1.1 | 1.2 3.2 0.1 1.1 |`; // Example dynamic update
      setContent(newContent); // Update state to trigger re-render
    });

    // Ensure that soundFont is loaded (optional, based on your needs)
    apiRef.current.soundFontLoaded.on(() => {
      console.log("Sound font loaded");
    });

    // Clean up the API instance when the component is unmounted
    return () => {
      apiRef.current = null;
    };
  }, []);

  // This effect will be triggered when content changes
  useEffect(() => {
    if (apiRef.current && content) {
      apiRef.current.tex(content); // Update content in AlphaTab
      apiRef.current.render();      // Re-render the notation after the content update
      console.log("Rendered new content with tex()");
    }
  }, [content]); // Runs every time 'content' state changes

  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      ref={ref}
      style={{
        width: "100%",
        maxHeight: "300px", // Set a fixed height for vertical scroll
        overflowY: "auto", // Enable vertical scroll if content overflows
        overflowX: "auto", // Prevent horizontal scroll
        padding: "10px",
      }}
    >
      {content} {/* Display the content for debugging purposes */}
    </div>
  );
};

export default GuitarTabEditor;
