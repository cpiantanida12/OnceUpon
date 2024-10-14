import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';

const genres = ['Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction', 'Mystery'];

const BrowseScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {genres.map((genre) => (
        <View key={genre} style={styles.genreSection}>
          <Text style={styles.genreTitle}>{genre}</Text>
          <FlatList
            horizontal
            data={[1, 2, 3, 4, 5]}
            renderItem={({ item }) => (
              <View style={styles.bookContainer}>
                {/* Replace this with an Image component in the future */}
                <View style={styles.bookPlaceholder} />
              </View>
            )}
            keyExtractor={(item) => item.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  genreSection: {
    marginBottom: 20,
  },
  genreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookContainer: {
    width: 100,
    height: 150,
    backgroundColor: 'grey',
    marginRight: 10,
  },
  bookPlaceholder: {
    flex: 1,
  },
});

export default BrowseScreen;
