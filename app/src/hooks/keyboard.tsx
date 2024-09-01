import React, { useEffect } from "react";

const KeyboardShortcut = ({ onTrigger }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if 'K' key is pressed along with Command (metaKey) or Control key
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault(); // Prevent default browser action (like 'Ctrl+K' opening browser search in some browsers)
        onTrigger(); // Call the function passed as a prop when shortcut is detected
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onTrigger]); // Re-run the effect if 'onTrigger' changes

  return null; // This component does not render anything visible
};

export default KeyboardShortcut;
