import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";

const genres = [
  "Teamwork",
  "Adventure",
  "Friendship",
  "Self-Discovery",
  "Problem-Solving",
];

const books = [
  {
    id: 1,
    title: "Zach and the Super Squad",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/zach-super-squad.jpg"),
    summary:
      "Zach discovers he has the power to control the wind, but he struggles to use it properly. Things take a turn when he gets recruited by the Super Squad—a group of kids with powers like invisibility, shape-shifting, and super speed. At first, Zach feels like he doesn’t belong, but when a new villain threatens their city, the team must learn to work together. Can Zach figure out how to control his powers and help save the day in time?",
  },
  {
    id: 2,
    title: "Luna and the Midnight Garden",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/luna_midnight.jpg"),
    summary:
      "Luna, a curious fox cub, hears a rumor about a hidden garden that only appears under the light of the full moon. Eager to explore, she sneaks out at night and stumbles upon strange glowing plants and mysterious puzzles guarding the garden’s secrets. Along the way, Luna meets an owl, a hedgehog, and a firefly, each with unique skills to help her on her journey. But as they work together, Luna realizes the garden may hold more than just mysteries—perhaps even the answers to questions she didn't know she had. What wonders await Luna beneath the midnight sky?",
  },
  {
    id: 3,
    title: "The Mystery of the Missing Homework",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/new-homework.jpg"),
    summary:
      "When a group of fourth-graders discovers that their homework is mysteriously disappearing, they are worried about getting in trouble with their strict teacher, Mr. Thompson. Determined to solve the mystery, friends Nina, Liam, and Aisha use their unique skills to set clever traps to catch the culprit. They soon uncover that classmate Jake has been taking the homework because he feels left out. Instead of being angry, the friends choose to help Jake and include him in their study group, turning a stressful situation into an opportunity for friendship and learning.",
  },
  {
    id: 4,
    title: "The River of Echoes",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/river_echoes.jpg"),
    summary:
      "Kai, a timid otter, hears tales about the River of Echoes—a place where voices from the past can be heard, guiding those brave enough to listen. When his village faces a problem that no one can solve, Kai decides to find the river and uncover its wisdom. Along the journey, Kai navigates rushing currents, eerie caves, and strange echoes that seem to know his fears. With each challenge, he grows a little stronger, but will he find the courage to face the biggest obstacle of all—believing in himself? What secrets will the river reveal to Kai?",
  },
  {
    id: 5,
    title: "Operation: Dragon Egg",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/dragon_egg.jpg"),
    summary:
      "During a school camping trip, a group of kids stumbles upon what looks like a glowing dragon egg deep in the forest. When they realize the egg is slowly cracking open, they decide they need to return it to the mysterious creature’s nest before nightfall. Each kid brings a unique skill—Jasper knows survival tricks, Priya is great with maps, and Leo keeps everyone calm under pressure. As they face tricky trails, puzzles, and unexpected obstacles, the group learns that only by combining their talents and trusting one another can they complete their mission before the egg hatches."
  },
  {
    id: 6,
    title: "The Great Balloon Race",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/new-balloonrace.jpg"),
    summary:
      "In the vibrant town of Breezyville, the annual Great Balloon Race is the highlight of the year. Eleven-year-old Mia teams up with her shy neighbor, Alex, a brilliant inventor but lacking confidence, to create a stunning balloon octopus. When a sudden storm sweeps them away during the race, they find themselves navigating strange lands filled with talking animals and whimsical creatures. As they work together to find their way back home, Mia and Alex learn valuable lessons about friendship, perseverance, and believing in themselves.",
  },
  {
    id: 7,
    title: "The Hidden Kingdom of Princess Lila",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/hidden-kingdom.jpg"),
    summary:
      "Princess Lila feels trapped inside the royal palace, longing for a life of adventure beyond the castle walls. When a strange map appears under her pillow one night, Lila discovers a hidden kingdom that only she can access. With the help of a talking fox and a magical compass, Lila sets out to uncover the kingdom’s secrets and find her true purpose. But not everyone she meets wants her to succeed—will Lila be brave enough to follow her heart?",
  },
  {
    id: 8,
    title: "Charlie and the Whispering Woods",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/new-whisperingwoods.jpg"),
    summary:
      "During a camping trip with his class, Charlie gets separated from the group and finds himself lost in a part of the forest no one has ever explored. Strange whispers echo through the trees, and glowing footprints lead him deeper into the woods. Charlie soon meets creatures who seem both helpful and mischievous, and he must figure out who to trust if he wants to find his way back. Will Charlie make it out before nightfall, or will the forest’s secrets keep him forever?",
  },
  {
    id: 9,
    title: "The Color Thief",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/color-thief.jpg"),
    summary:
      "In the vibrant town of Chromaville, colors bring joy and creativity to everyone’s lives. One day, the colors start to disappear, and the town becomes dull and gray. A young girl named Pippa discovers that a mischievous creature known as the Color Thief is stealing the colors for himself. With the help of her friends, Pippa embarks on a quest to retrieve the stolen colors. Along the way, they learn about the beauty of diversity, how different colors represent different ideas, and the importance of community. Will they be able to stop the Color Thief and restore the town’s brightness?",
  },
  {
    id: 10,
    title: "Bubbles and the Deep Sea Mystery",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/new-bubbles.jpg"),
    summary:
      "In the vibrant town of Chromaville, colors bring joy and creativity to everyone’s lives. One day, the colors start to disappear, and the town becomes dull and gray. A young girl named Pippa discovers that a mischievous creature known as the Color Thief is stealing the colors for himself. With the help of her friends, Pippa embarks on a quest to retrieve the stolen colors. Along the way, they learn about the beauty of diversity, how different colors represent different ideas, and the importance of community. Will they be able to stop the Color Thief and restore the town’s brightness?",
  },
  {
    id: 11,
    title: "The Time-Traveler's Journal",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/new-timetravel.jpg"),
    summary:
      "When Emma discovers an old journal in her grandfather's attic, she realizes it has the power to transport her back in time. Each entry takes her to a different moment in history, from ancient Egypt to the Renaissance. With the help of her skeptical best friend, Sam, Emma learns about the importance of historical events and the people who shaped them. But when a villain tries to change history for their own gain, Emma and Sam must race against time to preserve the past. Will they succeed in their quest, or will they change history forever?",
  },
  {
    id: 12,
    title: "The Trouble with Time Jars",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/new-timejar.jpg"),
    summary:
      "While cleaning out her attic, Mia stumbles upon jars labeled with “extra time.” Each jar can give her an extra hour in the day, and Mia uses them to have fun, skip chores, and get out of homework. But soon, things get tricky when she realizes time doesn’t flow the same for everyone else. Mia must decide how to use the remaining jars wisely—before she runs out of time for the people and things that matter most. How will she fix the mess she’s made before it’s too late?",
  },
  {
    id: 13,
    title: "The Lost Feather",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/lost_feather.jpg"),
    summary:
      "Finn, a young bird, loses a special feather that he believes gives him bravery. Determined to get it back, he ventures deep into the forest, meeting new friends along the way. Together, they face exciting challenges, and Finn begins to discover that courage might come from more than just his missing feather. Will Finn find his feather—and something even more valuable along the way?",
  },
  {
    id: 14,
    title: "The Invisible Friend",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/invisible_friend.jpg"),
    summary:
      "In the vibrant town of Breezyville, the annual Great Balloon Race is the highlight of the year. Eleven-year-old Mia teams up with her shy neighbor, Alex, a brilliant inventor but lacking confidence, to create a stunning balloon octopus. When a sudden storm sweeps them away during the race, they find themselves navigating strange lands filled with talking animals and whimsical creatures. As they work together to find their way back home, Mia and Alex learn valuable lessons about friendship, perseverance, and believing in themselves.",
  },
  {
    id: 15,
    title: "The Bench in the Big Oak Tree",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/bench_big_oak_tree.jpg"),
    summary:
      "During a camping trip with his class, Charlie gets separated from the group and finds himself lost in a part of the forest no one has ever explored. Strange whispers echo through the trees, and glowing footprints lead him deeper into the woods. Charlie soon meets creatures who seem both helpful and mischievous, and he must figure out who to trust if he wants to find his way back. Will Charlie make it out before nightfall, or will the forest’s secrets keep him forever?",
  },
  {
    id: 16,
    title: "The Switch-Up Sneakers",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/new-sneakers.jpg"),
    summary:
      "Jaden finds a strange pair of sneakers at a yard sale that seem ordinary—until he puts them on and realizes he can swap places with anyone who’s wearing their own shoes nearby! Curious and excited, Jaden uses the magic sneakers to experience life as different people at school: the fastest runner, the class clown, even the shyest kid. But the more Jaden switches lives, the more he discovers things aren't always as easy as they seem for others. What will he learn by walking in someone else’s shoes?",
  },
  {
    id: 17,
    title: "Princess Ivy and the Stolen Stars",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/new-stolen-stars.jpg"),
    summary:
      "One evening, Princess Ivy notices that the stars in the night sky are disappearing, one by one. With the help of a magical lantern, Ivy sets out on a quest to find the missing stars. Along the way, she encounters grumpy dragons, a forgetful wizard, and a cloud giant guarding the night sky. Ivy must use her wits and kindness to solve puzzles and convince the creatures to return the stars. Will she be able to restore the night sky before the kingdom falls into darkness?",
  },
  {
    id: 18,
    title: "The Robot Who Loved to Dance",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/robot-dance.jpg"),
    summary:
      "In a futuristic world where robots are built for specific tasks, a quirky little robot named Tink dreams of dancing. However, Tink was designed to be a cleaning robot, and everyone tells him dancing is not what he was made for. Undeterred, Tink secretly practices in the shadows, developing his own unique dance style. When the town announces a grand talent show, Tink sees his chance to shine. But when an unexpected glitch threatens to shut him down, Tink must rally his fellow robots and humans to showcase their talents and celebrate creativity. Can Tink prove that self-expression is more important than fitting into a mold?",
  },
  {
    id: 19,
    title: "The Lost Melody",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/lost_melody.jpg"),
    summary:
      "Lila, a talented but shy violinist, loves playing music but only when no one is listening. When her school announces a talent show, Lila feels torn—she wants to share her music but fears performing in front of others. After discovering an old, forgotten song tucked inside her violin case, she embarks on a journey to learn its origin. Along the way, she meets inspiring musicians, each encouraging her to embrace her gift. As Lila pieces together the song’s story, she discovers not just the melody’s history but also the courage to play her own tune for the world.",
  },
  {
    id: 20,
    title: "Nova and the Shadow Thief",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/shadow-thief.jpg"),
    summary:
      "Twelve-year-old Nova discovers she can create bursts of starlight with her hands, but every time she uses her power, a piece of her shadow disappears. When a mysterious villain called the Shadow Thief starts stealing the shadows of other kids, Nova realizes she may be the only one who can stop him. With the help of her best friend Milo and a former superhero mentor, Nova must learn to control her light powers while uncovering the truth behind the Shadow Thief’s dark plans. But as the final showdown draws closer, Nova wonders—can she really save the day without losing a part of herself?",
  },
  {
    id: 21,
    title: "The Missing Library Book",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/new-missingbook.jpg"),
    summary:
      "Owen checks out a mysterious book from the school library, only to misplace it before he even has the chance to read it. Desperate to find it before the librarian finds out, Owen enlists the help of his best friend, Mia. As they retrace his steps, they uncover clues that lead them on a wild scavenger hunt through school halls, playgrounds, and secret corners. But the book seems to hold more than just words—what will Owen and Mia discover about themselves along the way?",
  },
  {
    id: 22,
    title: "The Great Cookie Competiton",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/last-cookie-updated.jpg"),
    summary:
      "In a world where cookies are considered the ultimate treasure, the Great Cookie Competition is held annually to determine the best cookie maker. When Mia finds out that she has accidentally baked the last cookie on Earth, she must decide whether to keep it for herself or share it with her friends. As word spreads, the cookie draws the attention of cookie-crazed competitors, each determined to claim it for their own. Mia embarks on a journey filled with baking challenges, wacky cookie inventions, and lessons about friendship and sharing. Can she turn the last cookie into a symbol of togetherness instead of greed?",
  },
  {
    id: 23,
    title: "The Secret Clubhouse",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/secret-clubhouse.jpg"),
    summary:
      "Maya and her friends discover an old, abandoned treehouse hidden deep in the woods. Excited to make it their secret clubhouse, they soon realize it’s falling apart and needs serious repairs. Using their imagination and teamwork, they start fixing it up, but strange things keep happening—like messages written in chalk and mysterious objects appearing inside the clubhouse. Who could be leaving these clues, and what secret does the treehouse hold?",
  },
  {
    id: 24,
    title: "The Great Go-Kart Grand Prix",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/great_go_kart.jpg"),
    summary:
      "In the small town of Gearville, best friends Mia and Jake are excited to enter the Great Go-Kart Grand Prix with their homemade go-kart, but when they forget crucial supplies, they embark on a hilarious scavenger hunt around town. Gathering odd items from neighbors—a bicycle wheel from Mr. Thompson, a lawnmower engine from Mrs. Jenkins, and colorful pool noodles from the community pool—they face funny challenges, like convincing a grumpy neighbor to part with his lawnmower. On race day, with their quirky creation, they realize the true victory isn't about winning, but the fun and creativity they shared while building it.",
  },
  {
    id: 25,
    title: "The Puzzle of the Painted Door ",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/puzzle_of_painted_door.jpg"),
    summary:
      "When Maya discovers an old, colorful door in her attic, she is immediately drawn to it. However, it’s locked tight with no key in sight. Determined to uncover what lies behind the door, Maya enlists the help of her best friend, Sam. Together, they notice that the intricate patterns on the door resemble a series of puzzles scattered throughout their town. As they solve each puzzle—a riddle at the library, a math challenge at the park, and a treasure hunt in the town square—they uncover clues about the door’s origin. With each discovery, they learn to think outside the box and use their unique strengths. Will they finally unlock the door and reveal its secret, or will it remain a mystery forever?",
  },
];


const BrowseScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleImageClick = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBook(null); // Clear selected book when modal is closed
  };

  return (
    <ScrollView style={styles.container}>
      {genres.map((genre, index) => (
        <View key={genre} style={styles.genreSection}>
          <Text style={styles.genreTitle}>{genre}</Text>
          <FlatList
            horizontal
            data={books.slice(index * 5, index * 5 + 5)}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleImageClick(item)}>
                <View style={styles.bookContainer}>
                  <Image
                    source={item.image}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}

      {selectedBook && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedBook.title}</Text>
              <Text style={styles.modalTheme}>Theme: {selectedBook.theme}</Text>
              <Text style={styles.modalSummary}>{selectedBook.summary}</Text>
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>
      )}
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookContainer: {
    width: 100,
    height: 150,
    backgroundColor: "grey",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 5,
  },
  bookImage: {
    width: "150%",
    height: "100%",
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },
  modalSummary: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
  },
  modalTheme: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default BrowseScreen;
