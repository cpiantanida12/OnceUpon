import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import useHistory from "./useHistory";
import axios from "axios";
import * as Speech from "expo-speech";

const StoryScreen = () => {
  const { title, summary } = useGlobalSearchParams();
  const [story, setStory] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      const res = await axios.post("http://127.0.0.1:5000/generate-summary", {
        userInput: summary,
      });
      console.log(res);
      const storyRes = await axios.post(
        "http://127.0.0.1:5000/generate-story",
        { userInput: res.data.text }
      );
      console.log(storyRes);
      setStory(storyRes.data.text);
    };
    const fetchTitle = async () => {
      const res = await axios.post(
        "http://127.0.0.1:5000/generate-custom-title",
        {
          userSummary: summary,
        }
      );
      setCustomTitle(res.data.text);
    };
    fetchStory();
    if (title === undefined) fetchTitle();
  }, []);

  const startReadingStory = () => {
    Speech.stop();

    Speech.speak(story, {
      onDone: () => setIsPaused(false),
    });
    setIsPaused(false);
  };

  const togglePauseResume = () => {
    if (isPaused) {
      Speech.resume();
      setIsPaused(false); // Set state to "not paused" after resuming
    } else {
      Speech.pause();
      setIsPaused(true); // Set state to "paused" after pausing
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title ? title : customTitle}</Text>
        </View>
        {story ? (
          <View>
            <View style={styles.controls}>
              <Button title="Start" onPress={startReadingStory}/>
              <Button
                title={isPaused ? "Resume" : "Pause"}
                onPress={togglePauseResume}
              />
            </View>
            <Text style={styles.title}>{story}</Text>
          </View>
        ) : (
          <Text style={styles.title}>Give me a minute, I'm thinking...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginLeft: 10,
  },
  progress: {
    width: "30%",
    height: "100%",
    backgroundColor: "#6200ea",
    borderRadius: 5,
  },
});

export default StoryScreen;
