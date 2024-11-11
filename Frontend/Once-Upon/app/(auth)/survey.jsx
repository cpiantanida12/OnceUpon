import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SurveyPage = () => {
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const router = useRouter();

  const themes = [
    'Magic', 'Adventure', 'Superheroes', 'Animals', 'Fairy Tales', 
    'Space', 'Pirates', 'Dinosaurs', 'Underwater', 'Friendship',
    'Mystery', 'Time Travel', 'Treasure Hunt', 'Winter Wonderland', 
    'Sports Heroes', 'Jungle Exploration', 'Robots', 'Mythology'
  ];

  const hobbies = [
    'Drawing', 'Playing Games', 'Reading', 'Outdoor Adventures', 
    'Crafting', 'Coding', 'Sports', 'Dancing', 'Singing', 
    'Making Videos', 'Building Legos', 'Playing with Pets', 
    'Puzzles', 'Cooking', 'Science Experiments', 'Collecting Cards', 
    'Exploring Nature', 'Skateboarding'
  ];

  const toggleSelection = (item, selection, setSelection) => {
    if (selection.includes(item)) {
      setSelection(selection.filter((i) => i !== item));
    } else {
      setSelection([...selection, item]);
    }
  };

  const handleFinishSurvey = async () => {
    try {
      await AsyncStorage.removeItem('userEmail');  // Clear the email from AsyncStorage
      router.replace('/(auth)/login');  // Navigate to login page
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      Alert.alert('Error', 'Failed to complete the survey.');
    }
  };

  const handleSubmit = async () => {
    if (selectedThemes.length === 0 || selectedHobbies.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one theme and one hobby.');
      return;
    }

    try {
      // Retrieve the user's email from AsyncStorage
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        Alert.alert('Error', 'User email not found. Please log in again.');
        router.replace('/login');
        return;
      }

      // Send the survey data and email to the backend
      const response = await fetch('https://4abe-34-55-98-243.ngrok-free.app/auth/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          themes: selectedThemes,
          hobbies: selectedHobbies,
        }),
      });

      if (response.ok) {
        Alert.alert('Survey Submitted', 'Your preferences have been saved.');
        handleFinishSurvey();  // Clear storage and navigate to login after survey submission
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'An error occurred while submitting the survey.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while connecting to the server.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell Us About Your Interests</Text>

      <Text style={styles.sectionTitle}>Favorite Story Themes</Text>
      <View style={styles.optionsContainer}>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme}
            style={[
              styles.bubble,
              selectedThemes.includes(theme) && styles.selectedBubble,
            ]}
            onPress={() => toggleSelection(theme, selectedThemes, setSelectedThemes)}
          >
            <Text style={[
              styles.bubbleText, 
              selectedThemes.includes(theme) && styles.selectedText
            ]}>
              {theme}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Favorite Hobbies</Text>
      <View style={styles.optionsContainer}>
        {hobbies.map((hobby) => (
          <TouchableOpacity
            key={hobby}
            style={[
              styles.bubble,
              selectedHobbies.includes(hobby) && styles.selectedBubble,
            ]}
            onPress={() => toggleSelection(hobby, selectedHobbies, setSelectedHobbies)}
          >
            <Text style={[
              styles.bubbleText, 
              selectedHobbies.includes(hobby) && styles.selectedText
            ]}>
              {hobby}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#EFF8FE',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6200ea',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bubble: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
    backgroundColor: '#fff',
  },
  selectedBubble: {
    backgroundColor: '#6200ea',
    borderColor: '#6200ea',
  },
  bubbleText: {
    color: '#333',
  },
  selectedText: {
    color: '#fff', // Text turns white when selected
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SurveyPage;