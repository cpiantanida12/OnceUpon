// app/read.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const API_URL = "https://c5b1-35-222-33-243.ngrok-free.app";
const { width } = Dimensions.get("window");

export default function ReadScreen() {
  const router = useRouter();
  const { source } = useLocalSearchParams();
  const [story, setStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sound, setSound] = useState();
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadStory();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadStory = async () => {
    try {
      const storyData = await AsyncStorage.getItem("current_story");
      console.log("Retrieved story data:", storyData); // Debug log

      if (storyData) {
        const parsedStory = JSON.parse(storyData);
        console.log("Parsed story:", parsedStory); // Debug log

        // Validate the story data structure
        if (
          !parsedStory.chapters ||
          !parsedStory.chapters.chapter1 ||
          !parsedStory.chapters.chapter2 ||
          !parsedStory.chapters.chapter3
        ) {
          throw new Error("Invalid story format");
        }

        setStory(parsedStory);
      } else {
        throw new Error("No story data found");
      }
    } catch (error) {
      console.error("Error loading story:", error);

      // Show more descriptive error to user
      if (error.message === "Invalid story format") {
        setError(
          "Story data is incomplete or invalid. Please try generating the story again."
        );
      } else if (error.message === "No story data found") {
        setError("No story was found. Please generate a story first.");
      } else {
        setError("Failed to load story. Please try again.");
      }

      // Log detailed error for debugging
      console.log("Detailed error:", {
        message: error.message,
        stack: error.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  const getChapterContent = (chapterNumber) => {
    if (!story || !story.chapters) return "";

    const chapter = story.chapters[`chapter${chapterNumber}`];
    if (!chapter) return "";

    let chapterText = "";
    if (typeof chapter === "object") {
      // If it's an object, try to get the text content
      chapterText =
        chapter.chapter_text || chapter.text || JSON.stringify(chapter);
    } else if (typeof chapter === "string") {
      chapterText = chapter;
    }

    // Remove lines starting with '##' or "**"
    const filteredText = chapterText
      .split("\n") // Split text into lines
      .filter((line) => !(line.trim().startsWith("##") || line.trim().startsWith("**")))
      .join("\n"); // Join the lines back together

    return filteredText;
  };

  const readChapter = async () => {
    try {
      setLoadingAudio(true);

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setIsPaused(false);
      }

      const token = await AsyncStorage.getItem("jwt_token");
      const email = await AsyncStorage.getItem("user_email");

      const response = await fetch(`${API_URL}/chatbot/read-story`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          story: story.chapters[`chapter${currentChapter}`],
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();

        const audioUri = URL.createObjectURL(audioBlob);

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Failed to read chapter", error);
    } finally {
      setLoadingAudio(false);
    }
  };

  const handleChapterChange = async (chapter) => {
    setCurrentChapter(chapter);
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const pauseResumeChapter = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        setIsPaused(true);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        setIsPaused(false);
      }
    }
  };

  const handleBack = async () => {
    try {
      await AsyncStorage.removeItem("current_story");
      router.back();
    } catch (error) {
      console.error("Error clearing story data:", error);
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your story...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStory}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              AsyncStorage.removeItem("current_story")
                .then(() => router.back())
                .catch(console.error);
            }}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!story || !story.chapters || !Object.keys(story.chapters).length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="book-off" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>
            Story data is invalid or missing. Please try generating a new story.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              AsyncStorage.removeItem("current_story")
                .then(() => router.back())
                .catch(console.error);
            }}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Check if current chapter exists before rendering
  const currentChapterText = story.chapters[`chapter${currentChapter}`];
  if (!currentChapterText) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>
            Chapter data is missing. Please try generating the story again.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              AsyncStorage.removeItem("current_story")
                .then(() => router.back())
                .catch(console.error);
            }}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
            
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      />
            
      <SafeAreaView style={styles.container}>
                
        <View style={styles.header}>
                    
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
                        
            <Text style={styles.backButtonText}>
                            Back to {source === "build" ? "Chat" : "Browse"}
                          
            </Text>
                      
          </TouchableOpacity>
                    <Text style={styles.title}>Your Story</Text>
                  
        </View>
                
        <View style={styles.chapterNavigation}>
                    
          {[1, 2, 3].map((chapter) => (
            <TouchableOpacity
              key={chapter}
              style={[
                styles.chapterButton,
                currentChapter === chapter && styles.activeChapterButton,
              ]}
              onPress={() => handleChapterChange(chapter)}
            >
                            
              <Text
                style={[
                  styles.chapterButtonText,
                  currentChapter === chapter && styles.activeChapterButtonText,
                ]}
              >
                                Chapter {chapter}
                              
              </Text>
                          
            </TouchableOpacity>
          ))}
                  
        </View>
                
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentPadding}
        >
          <Text style={styles.chapterTitle}>Chapter {currentChapter}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={readChapter}
              disabled={loadingAudio}
              style={[
                styles.actionButton,
                loadingAudio && styles.disabledButton,
              ]}
            >
              {loadingAudio ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isPaused ? "Restart" : isPlaying ? "Restart" : "Play"}
                </Text>
              )}
            </TouchableOpacity>
            {sound && (
              <TouchableOpacity
                onPress={pauseResumeChapter}
                style={styles.actionButton}
              >
                <Text style={styles.buttonText}>
                  {isPlaying ? "Pause" : "Resume"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* This is the updated chapter text rendering */}
          <Text style={styles.storyText}>
            {getChapterContent(currentChapter)}
          </Text>
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 48, // Balance the back button
  },
  chapterNavigation: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  chapterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    minWidth: width * 0.25,
    alignItems: "center",
  },
  activeChapterButton: {
    backgroundColor: "#007AFF",
  },
  chapterButtonText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  activeChapterButtonText: {
    color: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentPadding: {
    padding: 16,
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1C1C1E",
  },
  storyText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333333",
    letterSpacing: 0.2,
  },
  bottomPadding: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666666",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
    textAlign: "center",
    marginVertical: 16,
    maxWidth: "80%",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 12,
    minWidth: 120,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Add space between the buttons
    alignItems: "center",
    marginVertical: 16, // Adjust vertical spacing
  },
  actionButton: {
    flex: 1, // Ensures buttons take equal space
    marginHorizontal: 8, // Add spacing between buttons
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0", // Lighter gray for disabled state
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
};
