import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useHistory from './useHistory'; 

// import { useSearchParams } from 'expo-router';


// const useHistory = () => {
//   const [history, setHistory] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     // Log current path and history for debugging
//     console.log('Current Path:', router.asPath);
//     console.log('History Before Update:', history);

//     setHistory(prevHistory => {
//       if (prevHistory[prevHistory.length - 1] !== router.asPath) {
//         const newHistory = [...prevHistory, router.asPath];
//         console.log('Updated History:', newHistory);
//         return newHistory;
//       }
//       return prevHistory;
//     });
//   }, [router.asPath]);

//   const goBack = () => {
//     setHistory(prevHistory => {
//       const newHistory = [...prevHistory];
//       newHistory.pop(); // Remove the last entry
//       if (newHistory.length > 0) {
//         const previousPath = newHistory[newHistory.length - 1];
//         router.push(previousPath); // Navigate to the previous path
//       } else {
//         router.back(); // Fallback to router.back() if no history left
//       }
//       console.log('History:', newHistory);
//       return newHistory;
//     });
//   };

//   return { history, goBack };
// };

// const getQueryParams = () => {
//     const search = window.location.search;
//     console.log("Search:", search)
//     const params = new URLSearchParams(search);
//     return Object.fromEntries(params.entries());
//   };

//   const { from } = getQueryParams();

//   const handleBack = () => {
//     if (from === 'build') {
//       router.push('/build');
//     } else {
//       router.back();
//     }
//   };

const StoryScreen = () => {
//   const { goBack } = getQueryParams();
  //const { goBack } = useHistory();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity> */}
        <Text style={styles.headerText}>Story</Text>
      </View>
      <Text style={styles.title}>This is the story that you generated. I hope you like it. This is obviously just a placeholder lmao.</Text>
      <View style={styles.controls}>
        <Button title="Play" onPress={() => {}} />
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
      </View>
    </View>
  );
};


// const StoryScreen = () => {
//   const router = useRouter();
//   // const params = useSearchParams();
//   // const from = params.from;
//     const handleBack = () => {
//       router.back();
//     };

//   // const handleBack = () => {
//   //   console.log(from)
//   //   if (from === 'build') {
//   //     router.push('/build');
//   //   } else {
//   //     router.back();
//   //   }
//   // };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Story</Text>
//       </View>
//       <Text style={styles.title}>This is the story that you generated. I hope you like it. This is obviously just a placeholder lmao.</Text>
//       <View style={styles.controls}>
//         <Button title="Play" onPress={() => {}} />
//         <View style={styles.progressBar}>
//           <View style={styles.progress} />
//         </View>
//       </View>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginLeft: 10,
  },
  progress: {
    width: '30%',
    height: '100%',
    backgroundColor: '#6200ea',
    borderRadius: 5,
  },
});

export default StoryScreen;
