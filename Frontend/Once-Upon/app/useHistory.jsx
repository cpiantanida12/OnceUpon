import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

const useHistory = () => {
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Log current path and history for debugging
    const currentPath = router.asPath || router.route;
    console.log('Current Path:', currentPath);
    console.log('History Before Update:', history);

    setHistory(prevHistory => {
      if (prevHistory[prevHistory.length - 1] !== currentPath) {
        const newHistory = [...prevHistory, currentPath];
        console.log('Updated History:', newHistory);
        return newHistory;
      }
      return prevHistory;
    });
  }, [router.asPath, router.route]);

  const goBack = () => {
    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory.pop(); // Remove the last entry
      if (newHistory.length > 0) {
        const previousPath = newHistory[newHistory.length - 1];
        router.push(previousPath); // Navigate to the previous path
      } else {
        router.back(); // Fallback to router.back() if no history left
      }
      console.log('History:', newHistory);
      return newHistory;
    });
  };

  return { history, goBack };
};

export default useHistory;
