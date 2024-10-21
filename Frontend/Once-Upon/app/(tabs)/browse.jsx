import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, Image } from 'react-native';

const genres = ['Teamwork', 'Adventure', 'Friendship', 'Self-Discovery', 'Problem-Solving'];

const images = [
  require('../../assets/images/browse-page-images/zach-super-squad.jpg'),
  require('../../assets/images/browse-page-images/luna_midnight.jpg'),
  require('../../assets/images/browse-page-images/science-fair.jpg'),
  require('../../assets/images/browse-page-images/river_echoes.jpg'),
  require('../../assets/images/browse-page-images/new-homework.jpg'),
  require('../../assets/images/browse-page-images/new-balloonrace.jpg'),
  require('../../assets/images/browse-page-images/hidden-kingdom.jpg'),
  require('../../assets/images/browse-page-images/new-whisperingwoods.jpg'),
  require('../../assets/images/browse-page-images/color-thief.jpg'),
  require('../../assets/images/browse-page-images/new-bubbles.jpg'),
  require('../../assets/images/browse-page-images/new-timetravel.jpg'),
  require('../../assets/images/browse-page-images/new-timejar.jpg'),
  require('../../assets/images/browse-page-images/new-whisperingwoods.jpg'),
  require('../../assets/images/browse-page-images/new-balloonrace.jpg'),
  require('../../assets/images/browse-page-images/lost_feather.jpg'),
  require('../../assets/images/browse-page-images/new-sneakers.jpg'),
  require('../../assets/images/browse-page-images/new-stolen-stars.jpg'),
  require('../../assets/images/browse-page-images/robot-dance.jpg'),
  require('../../assets/images/browse-page-images/river_echoes.jpg'),
  require('../../assets/images/browse-page-images/shadow-thief.jpg'),
  require('../../assets/images/browse-page-images/new-missingbook.jpg'),
  require('../../assets/images/browse-page-images/new-stolen-stars.jpg'),
  require('../../assets/images/browse-page-images/secret-clubhouse.jpg'),
  require('../../assets/images/browse-page-images/luna_midnight.jpg'),
  require('../../assets/images/browse-page-images/science-fair.jpg'),
]

const BrowseScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {genres.map((genre, index) => (
        <View key={genre} style={styles.genreSection}>
          <Text style={styles.genreTitle}>{genre}</Text>
          <FlatList
            horizontal
            data={images.slice(index * 5, index * 5 + 5)}
            renderItem={({ item }) => (
              <View style={styles.bookContainer}>
                {/* Replace this with an Image component in the future */}
                <Image source={item} style={styles.bookImage} />
              </View>
            )}
            keyExtractor={(item, index) => item.toString()}
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
  bookImage: {
    width: 100,
    height: 150,
  },
});

export default BrowseScreen;
