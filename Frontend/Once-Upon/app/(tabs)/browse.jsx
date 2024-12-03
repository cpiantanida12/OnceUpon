import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://f9bf-34-71-69-121.ngrok-free.app';
const { width } = Dimensions.get('window');

const NotificationModal = ({ visible, message, onClose, type = 'info' }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.notificationModalContainer}>
      <View style={styles.notificationModalContent}>
        {type === 'loading' && (
          <ActivityIndicator size="large" color="#007AFF" style={styles.notificationSpinner} />
        )}
        <Text style={styles.notificationText}>{message}</Text>
        {type !== 'loading' && (
          <TouchableOpacity style={styles.notificationButton} onPress={onClose}>
            <Text style={styles.notificationButtonText}>OK</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </Modal>
);

const genres = [
  "Teamwork",
  "Adventure",
  "Friendship",
  "Self-Discovery",
  "Problem-Solving",
  "Family"
];

const books = [
  {
    id: 1,
    title: "Zach and the Super Squad",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/zach-super-squad.jpg"),
    summary: "Zach discovers he has the power to control the wind, but he struggles to use it properly. Things take a turn when he gets recruited by the Super Squad—a group of kids with powers like invisibility, shape-shifting, and super speed. At first, Zach feels like he doesn’t belong, but when a new villain threatens their city, the team must learn to work together. Can Zach figure out how to control his powers and help save the day in time?"
  },
  {
    id: 2,
    title: "Luna and the Midnight Garden",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/luna_midnight-new.jpg"),
    summary: "Luna, a curious fox cub, hears a rumor about a hidden garden that only appears under the light of the full moon. Eager to explore, she sneaks out at night and stumbles upon strange glowing plants and mysterious puzzles guarding the garden’s secrets. Along the way, Luna meets an owl, a hedgehog, and a firefly, each with unique skills to help her on her journey. But as they work together, Luna realizes the garden may hold more than just mysteries—perhaps even the answers to questions she didn't know she had. What wonders await Luna beneath the midnight sky?"
  },
  {
    id: 3,
    title: "The Mystery of the Missing Homework",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/new-homework.jpg"),
    summary: "When a group of fourth-graders discovers that their homework is mysteriously disappearing, they are worried about getting in trouble with their strict teacher, Mr. Thompson. Determined to solve the mystery, friends Nina, Liam, and Aisha use their unique skills to set clever traps to catch the culprit. They soon uncover that classmate Jake has been taking the homework because he feels left out. Instead of being angry, the friends choose to help Jake and include him in their study group, turning a stressful situation into an opportunity for friendship and learning."
  },
  {
    id: 4,
    title: "Operation: Dragon Egg",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/dragon_egg.jpg"),
    summary: "During a school camping trip, a group of kids stumbles upon what looks like a glowing dragon egg deep in the forest. When they realize the egg is slowly cracking open, they decide they need to return it to the mysterious creature’s nest before nightfall. Each kid brings a unique skill—Jasper knows survival tricks, Priya is great with maps, and Leo keeps everyone calm under pressure. As they face tricky trails, puzzles, and unexpected obstacles, the group learns that only by combining their talents and trusting one another can they complete their mission before the egg hatches."
  },
  {
    id: 5,
    title: "The Rescue at Stormy Peak",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/rescue_story_peak.jpg"),
    summary: "When a fierce storm traps their village on the edge of Stormy Peak, three unlikely heroes—Finn, a shy artist; Maya, a fearless athlete; and Raj, a quiet mathematician—are called to help. The mountain pass is blocked, and the village's supplies are running low. With only their unique talents to guide them, they must work together to find a new way over the peak. As they face wild winds, dangerous cliffs, and tricky puzzles, they realize that the strength of their friendship—and the power of teamwork—might just be the key to saving the village. Will they make it in time, or will the storm win?"
  },
  {
    id: 6,
    title: "The Mystery of the Whispering Caves",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/mystery_whispering_caves.jpg"),
    summary: "Lila, Tom, and Aiden have always been curious about the Whispering Caves, an ancient network of tunnels said to hold a long-lost treasure. When they decide to explore, they quickly realize the caves are filled with puzzles that can only be solved with teamwork. Lila’s sharp memory helps them recall clues, Tom’s quick thinking saves them from traps, and Aiden’s bravery leads the way through dark, narrow passages. But when they reach the final chamber, a riddle stands between them and the treasure. Can they combine their skills and solve the mystery before the caves close forever?"
  },
  {
    id: 7,
    title: "The Skyward Adventure",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/skyward_adventure.jpg"),
    summary: "In a small town where everyone dreams of flying, best friends Ava, Leo, and Maya decide to build a flying machine to enter the Skyward Race, a competition to soar over the highest mountain. Ava’s artistic vision creates the design, Leo’s engineering skills bring it to life, and Maya’s courage pushes them to keep going when things get tough. But when the machine faces unexpected challenges, like broken wings and shifting winds, they must use their individual strengths in ways they never imagined. Will their combined efforts help them overcome the obstacles and reach the finish line, or will their dreams of flight come crashing down?"
  },
  {
    id: 8,
    title: "The Race to the Golden Willow",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/race_to_golden_willow.jpeg"),
    summary: "In the village of Greenwood, a long-standing tradition called the Great Adventure Race brings teams together to compete for the legendary Golden Willow Trophy. This year, four friends—Nina, Jack, Maya, and Ben—decide to form a team. Each of them has a unique skill: Nina is quick with maps, Jack is a problem solver, Maya has great endurance, and Ben is the fastest runner. As they race through forests, across rivers, and over mountains, they face challenges that can only be conquered by working together. From crossing a rickety bridge to solving a tricky puzzle, they realize that teamwork is the secret to success. Will their combined efforts be enough to win the Golden Willow, or will the competition be too fierce?"
  },
  {
    id: 9,
    title: "The Great Garden Adventure",
    theme: "Teamwork",
    image: require("../../assets/images/browse-page-images/great_garden_adventure.jpeg"),
    summary: "Zoe, Liam, and Ava have always dreamed of transforming the empty lot next to their house into the most beautiful garden in the neighborhood. One Saturday, they decide to make it happen. Armed with seeds, gardening tools, and a lot of excitement, they begin planting. But soon, things go wrong—the flowers don’t line up, the soil isn’t rich enough, and the plants aren’t growing as expected. Instead of giving up, they decide to work together in new ways. Zoe becomes the planner, creating a map for the garden layout. Liam handles the planting, digging, and watering, while Ava takes care of the compost and soil. After a long day of hard work, the garden begins to take shape, and they realize that when everyone does their part, amazing things grow. By the end of the week, their garden is blooming with color, and they know the true beauty of it came from their teamwork."
  },  
  {
    id: 10,
    title: "The Great Balloon Race",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/new-balloonrace.jpg"),
    summary:
      "In the vibrant town of Breezyville, the annual Great Balloon Race is the highlight of the year. Eleven-year-old Mia teams up with her shy neighbor, Alex, a brilliant inventor but lacking confidence, to create a stunning balloon octopus. When a sudden storm sweeps them away during the race, they find themselves navigating strange lands filled with talking animals and whimsical creatures. As they work together to find their way back home, Mia and Alex learn valuable lessons about friendship, perseverance, and believing in themselves."
  },
  {
    id: 11,
    title: "The Hidden Kingdom of Princess Lila",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/hidden-kingdom.jpg"),
    summary:
      "Princess Lila feels trapped inside the royal palace, longing for a life of adventure beyond the castle walls. When a strange map appears under her pillow one night, Lila discovers a hidden kingdom that only she can access. With the help of a talking fox and a magical compass, Lila sets out to uncover the kingdom’s secrets and find her true purpose. But not everyone she meets wants her to succeed—will Lila be brave enough to follow her heart?"
  },
  {
    id: 12,
    title: "Charlie and the Whispering Woods",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/new-whisperingwoods.jpg"),
    summary:
      "During a camping trip with his class, Charlie gets separated from the group and finds himself lost in a part of the forest no one has ever explored. Strange whispers echo through the trees, and glowing footprints lead him deeper into the woods. Charlie soon meets creatures who seem both helpful and mischievous, and he must figure out who to trust if he wants to find his way back. Will Charlie make it out before nightfall, or will the forest’s secrets keep him forever?"
  },
  {
    id: 13,
    title: "The Color Thief",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/color-thief.jpg"),
    summary:
      "In the vibrant town of Chromaville, colors bring joy and creativity to everyone’s lives. One day, the colors start to disappear, and the town becomes dull and gray. A young girl named Pippa discovers that a mischievous creature known as the Color Thief is stealing the colors for himself. With the help of her friends, Pippa embarks on a quest to retrieve the stolen colors. Along the way, they learn about the beauty of diversity, how different colors represent different ideas, and the importance of community. Will they be able to stop the Color Thief and restore the town’s brightness?"
  },
  {
    id: 14,
    title: "Bubbles and the Deep Sea Mystery",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/new-bubbles.jpg"),
    summary:
      "In the vibrant town of Chromaville, colors bring joy and creativity to everyone’s lives. One day, the colors start to disappear, and the town becomes dull and gray. A young girl named Pippa discovers that a mischievous creature known as the Color Thief is stealing the colors for himself. With the help of her friends, Pippa embarks on a quest to retrieve the stolen colors. Along the way, they learn about the beauty of diversity, how different colors represent different ideas, and the importance of community. Will they be able to stop the Color Thief and restore the town’s brightness?"
  },
  {
    id: 15,
    title: "The Forgotten Island",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/forgotten_island.jpg"),
    summary:
      "When a mysterious map washes up on the beach near his home, Finn is drawn into the adventure of a lifetime. The map leads to a hidden island, long thought to be a legend. With his best friend, Emma, by his side, Finn sets off on a daring journey across the seas, facing stormy waters, curious creatures, and dangerous obstacles. As they uncover secrets about the island’s past, they realize that the island holds more than treasure—it holds a powerful secret that could change the world. Will Finn and Emma be able to solve the island’s riddles and escape its dangers, or will the island keep its secrets forever?"
  },
  {
    id: 16,
    title: "The Quest for the Firestone",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/quest_firestone.jpg"),
    summary:
      "In a land where darkness has begun to spread, 12-year-old Kai learns of a legendary Firestone that can bring light back to the world. With his adventurous spirit and his trusty sword, Kai sets off on a journey across rugged mountains and through ancient forests to find the stone. Along the way, he is joined by a clever fox named Nyx, a brave warrior named Aira, and a mysterious guide who knows more than he lets on. But the Firestone is guarded by ancient traps and fierce creatures. Will Kai and his friends overcome the dangers ahead, or will the darkness consume everything? The adventure is just beginning."
  },
  {
    id: 17,
    title: "The Crystal Cavern",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/crystal_caverns.jpg"),
    summary:
      "Lena and her younger brother, Theo, always dreamed of exploring the legendary Crystal Cavern, a place filled with sparkling gems said to have magical powers. One day, while exploring the outskirts of their village, they find an old entrance hidden behind a waterfall. Excited, they venture deep into the cave, where they encounter glowing crystals, secret passages, and mysterious guardians that test their courage. But as they go further, the path splits, and they must choose between two very different routes. Will they find the magical crystal at the heart of the cavern, or will the challenges they face lead them to unexpected discoveries? The greatest adventure is about to unfold."
  },
  {
    id: 18,
    title: "The Island of Forgotten Dreams",
    theme: "Adventure",
    image: require("../../assets/images/browse-page-images/island_forgotten_dreams.jpeg"),
    summary:
      "When cousins Ava and Jack find a strange, half-buried chest on the beach during a family vacation, they uncover an old compass that points to an uncharted island off the coast. The compass, however, seems to move on its own, leading them on a journey to a place where time feels different, and the world seems full of secrets. As they sail across the sea to the mysterious island, they encounter wild creatures, hidden caves, and puzzles that challenge their creativity and teamwork. The deeper they explore, the more they realize the island is tied to forgotten dreams of the past. What they discover could change everything they thought they knew about adventure—and themselves. Will they solve the island’s mysteries before the tides change forever?"
  },
  {
    id: 19,
    title: "The Time-Traveler's Journal",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/new-timetravel.jpg"),
    summary:
      "When Emma discovers an old journal in her grandfather's attic, she realizes it has the power to transport her back in time. Each entry takes her to a different moment in history, from ancient Egypt to the Renaissance. With the help of her skeptical best friend, Sam, Emma learns about the importance of historical events and the people who shaped them. But when a villain tries to change history for their own gain, Emma and Sam must race against time to preserve the past. Will they succeed in their quest, or will they change history forever?"
  },
  {
    id: 20,
    title: "The Trouble with Time Jars",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/new-timejar.jpg"),
    summary:
      "While cleaning out her attic, Mia stumbles upon jars labeled with “extra time.” Each jar can give her an extra hour in the day, and Mia uses them to have fun, skip chores, and get out of homework. But soon, things get tricky when she realizes time doesn’t flow the same for everyone else. Mia must decide how to use the remaining jars wisely—before she runs out of time for the people and things that matter most. How will she fix the mess she’s made before it’s too late?"
  },
  {
    id: 21,
    title: "The Lost Feather",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/lost_feather.jpg"),
    summary:
      "Finn, a young bird, loses a special feather that he believes gives him bravery. Determined to get it back, he ventures deep into the forest, meeting new friends along the way. Together, they face exciting challenges, and Finn begins to discover that courage might come from more than just his missing feather. Will Finn find his feather—and something even more valuable along the way?"
  },
  {
    id: 22,
    title: "The Invisible Friend",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/invisible_friend.jpg"),
    summary:
      "Oliver, a quiet boy who feels out of place at his new school, stumbles upon a magical bracelet that makes him invisible. Thrilled at first, he uses his new power to avoid awkward situations and sneak around unnoticed. But when he overhears other kids talking about their struggles and fears, Oliver realizes he’s not as alone as he thought. With the help of Emma, a fellow outsider who sees through his invisibility, Oliver learns that sometimes, being seen is the bravest thing of all. Will he find the courage to reveal his true self to his classmates?"
  },
  {
    id: 23,
    title: "The Bench in the Big Oak Tree",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/bench_big_oak_tree.jpg"),
    summary:
      "Sam and Leo have spent every summer afternoon sitting on the old bench beneath the giant oak tree, sharing dreams, snacks, and secrets. But when Leo learns that his family is moving to a new city, both friends struggle with the fear of saying goodbye. Determined to make their last days together unforgettable, they set out on a mission to build something that will keep their friendship alive—a time capsule buried beneath their beloved tree. As the moving day approaches, Sam and Leo learn that true friendship can endure, no matter how far apart they are.",
  },
  {
    id: 24,
    title: "The Secret Tunnel of Friendship",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/secret_tunnel_friendship.jpg"),
    summary: "Lily and Ben have been best friends since they could remember, but when Ben’s family moves to a faraway town, they promise to stay in touch no matter what. One day, Lily discovers an old map in her attic, leading to a secret tunnel that supposedly connects her house to Ben’s new town. Determined to surprise her friend, Lily sets off on an adventure to find the tunnel. Along the way, she encounters tricky obstacles and mysterious creatures, all while remembering the importance of friendship. Will the tunnel be real, and will Lily be able to keep her promise to Ben?"
  },
  {
    id: 25,
    title: "The Great Science Fair Team",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/great_science_fair.jpg"),
    summary: "At Willowbrook School, the annual science fair is the highlight of the year, and three best friends—Jake, Sarah, and Mia—decide to enter as a team. Each of them has a different idea for the perfect project: Jake wants to build a robot, Sarah wants to create a garden that cleans air, and Mia dreams of making a volcano that erupts in rainbow colors. At first, their ideas clash, and they struggle to agree on how to combine their strengths. But through teamwork, patience, and a lot of laughter, they discover that the best projects are the ones made together. Can their friendship turn a pile of ideas into a winning creation?"
  },
  {
    id: 26,
    title: "The Mystery of the Vanishing Paintings",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/mysterty_vanishing_paintings.jpg"),
    summary: "At Maple Grove School, Lily and Jack, best friends since kindergarten, are excited about their school's annual art exhibition. But when paintings begin disappearing from the display, they know something strange is going on. Together, they decide to investigate, combining Lily’s sharp eye for detail with Jack’s love for solving puzzles. As they uncover clues and follow a trail of mysterious symbols, they realize the mystery is much bigger than they thought. Along the way, they learn that friendship is the key to solving any puzzle. Can their teamwork help them unravel the secret behind the vanishing paintings before it’s too late?"
  },
  {
    id: 27,
    title: "The Adventure Club",
    theme: "Friendship",
    image: require("../../assets/images/browse-page-images/adventure_club.jpeg"),
    summary: "Lily and Jake have been best friends since they could remember, but lately, they’ve felt like something’s missing in their friendship. One day, they decide to start their own 'Adventure Club,' where they promise to embark on new adventures every week—no matter how big or small. From exploring the mysterious woods near their neighborhood to starting a treasure hunt through their school, each adventure brings them closer. Along the way, they discover that the greatest adventure of all is the one they’re sharing together. But when they face their biggest challenge yet—a high cliff to climb—they must rely on each other more than ever. Can their friendship survive the toughest adventure they’ve ever faced?"
  },
  {
    id: 28,
    title: "The Switch-Up Sneakers",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/new-sneakers.jpg"),
    summary: "Jaden finds a strange pair of sneakers at a yard sale that seem ordinary—until he puts them on and realizes he can swap places with anyone who’s wearing their own shoes nearby! Curious and excited, Jaden uses the magic sneakers to experience life as different people at school: the fastest runner, the class clown, even the shyest kid. But the more Jaden switches lives, the more he discovers things aren't always as easy as they seem for others. What will he learn by walking in someone else’s shoes?"
  },
  {
    id: 29,
    title: "Princess Ivy and the Stolen Stars",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/new-stolen-stars.jpg"),
    summary: "One evening, Princess Ivy notices that the stars in the night sky are disappearing, one by one. With the help of a magical lantern, Ivy sets out on a quest to find the missing stars. Along the way, she encounters grumpy dragons, a forgetful wizard, and a cloud giant guarding the night sky. Ivy must use her wits and kindness to solve puzzles and convince the creatures to return the stars. Will she be able to restore the night sky before the kingdom falls into darkness?"
  },
  {
    id: 30,
    title: "The Robot Who Loved to Dance",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/robot-dance.jpg"),
    summary: "In a futuristic world where robots are built for specific tasks, a quirky little robot named Tink dreams of dancing. However, Tink was designed to be a cleaning robot, and everyone tells him dancing is not what he was made for. Undeterred, Tink secretly practices in the shadows, developing his own unique dance style. When the town announces a grand talent show, Tink sees his chance to shine. But when an unexpected glitch threatens to shut him down, Tink must rally his fellow robots and humans to showcase their talents and celebrate creativity. Can Tink prove that self-expression is more important than fitting into a mold?"
  },
  {
    id: 31,
    title: "The Lost Melody",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/lost_melody.jpg"),
    summary: "Lila, a talented but shy violinist, loves playing music but only when no one is listening. When her school announces a talent show, Lila feels torn—she wants to share her music but fears performing in front of others. After discovering an old, forgotten song tucked inside her violin case, she embarks on a journey to learn its origin. Along the way, she meets inspiring musicians, each encouraging her to embrace her gift. As Lila pieces together the song’s story, she discovers not just the melody’s history but also the courage to play her own tune for the world."
  },
  {
    id: 32,
    title: "Nova and the Shadow Thief",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/shadow-thief.jpg"),
    summary: "Twelve-year-old Nova discovers she can create bursts of starlight with her hands, but every time she uses her power, a piece of her shadow disappears. When a mysterious villain called the Shadow Thief starts stealing the shadows of other kids, Nova realizes she may be the only one who can stop him. With the help of her best friend Milo and a former superhero mentor, Nova must learn to control her light powers while uncovering the truth behind the Shadow Thief’s dark plans. But as the final showdown draws closer, Nova wonders—can she really save the day without losing a part of herself?"
  },
  {
    id: 33,
    title: "The Voice Inside",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/voice_inside.jpg"),
    summary: "Ever since he could remember, Noah has been told he’s too quiet. His teachers, friends, and even his parents think he should speak up more, but Noah isn’t so sure. One summer, he finds an old journal belonging to his grandfather, a man known for his quiet wisdom. Intrigued, Noah begins reading and discovers that his grandfather once felt the same way—until he learned how to use his quietness as a strength. As Noah goes on a personal journey of reflection, he learns that being true to himself doesn’t mean being loud. Sometimes, the most powerful voice is the one that listens."
  },
  {
    id: 34,
    title: "The Colors of Me",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/colors_of_me.jpg"),
    summary: "Maya has always loved painting, but she’s never felt her art was “good enough.” While everyone around her encourages her to paint what’s “beautiful” or “perfect,” she starts to feel like she’s lost touch with what truly makes her happy. One day, Maya stumbles upon an abandoned art studio in the woods, filled with vibrant, wild paintings that look nothing like what she’s seen before. As she spends time in the studio, she learns to paint what’s in her heart, discovering that true self-expression comes from embracing her own unique colors. Will Maya learn to trust her own artistic voice and let her creativity shine?"
  },
  {
    id: 35,
    title: "The Song of the Wind",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/song_of_wind.jpg"),
    summary: "Luca has always felt out of place in his small village. While everyone else loves the sound of the village bells and the songs of the birds, Luca is drawn to the wind—its whispers and how it dances through the trees. His friends don’t understand why he’s fascinated by something so simple, and Luca begins to feel like he doesn’t belong. One day, after a storm, he sets out to follow the wind’s path, learning to listen to its song. Along the way, Luca discovers that his unique connection to the wind is part of who he is. By embracing his difference, Luca realizes that his true self is something to be celebrated, not hidden. Will he find the courage to share his discovery with others?"
  },
  {
    id: 36,
    title: "The River of Echoes",
    theme: "Self-Discovery",
    image: require("../../assets/images/browse-page-images/river_echoes.jpg"),
    summary: "Kai, a timid otter, hears tales about the River of Echoes—a place where voices from the past can be heard, guiding those brave enough to listen. When his village faces a problem that no one can solve, Kai decides to find the river and uncover its wisdom. Along the journey, Kai navigates rushing currents, eerie caves, and strange echoes that seem to know his fears. With each challenge, he grows a little stronger, but will he find the courage to face the biggest obstacle of all—believing in himself? What secrets will the river reveal to Kai?"
  },
  {
    id: 37,
    title: "The Missing Library Book",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/new-missingbook.jpg"),
    summary:
      "Owen checks out a mysterious book from the school library, only to misplace it before he even has the chance to read it. Desperate to find it before the librarian finds out, Owen enlists the help of his best friend, Mia. As they retrace his steps, they uncover clues that lead them on a wild scavenger hunt through school halls, playgrounds, and secret corners. But the book seems to hold more than just words—what will Owen and Mia discover about themselves along the way?",
  },
  {
    id: 38,
    title: "The Great Cookie Competiton",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/last-cookie-updated.jpg"),
    summary:
      "In a world where cookies are considered the ultimate treasure, the Great Cookie Competition is held annually to determine the best cookie maker. When Mia finds out that she has accidentally baked the last cookie on Earth, she must decide whether to keep it for herself or share it with her friends. As word spreads, the cookie draws the attention of cookie-crazed competitors, each determined to claim it for their own. Mia embarks on a journey filled with baking challenges, wacky cookie inventions, and lessons about friendship and sharing. Can she turn the last cookie into a symbol of togetherness instead of greed?",
  },
  {
    id: 39,
    title: "The Secret Clubhouse",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/secret-clubhouse.jpg"),
    summary:
      "Maya and her friends discover an old, abandoned treehouse hidden deep in the woods. Excited to make it their secret clubhouse, they soon realize it’s falling apart and needs serious repairs. Using their imagination and teamwork, they start fixing it up, but strange things keep happening—like messages written in chalk and mysterious objects appearing inside the clubhouse. Who could be leaving these clues, and what secret does the treehouse hold?",
  },
  {
    id: 40,
    title: "The Great Go-Kart Grand Prix",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/great_go_kart.jpg"),
    summary:
      "In the small town of Gearville, best friends Mia and Jake are excited to enter the Great Go-Kart Grand Prix with their homemade go-kart, but when they forget crucial supplies, they embark on a hilarious scavenger hunt around town. Gathering odd items from neighbors—a bicycle wheel from Mr. Thompson, a lawnmower engine from Mrs. Jenkins, and colorful pool noodles from the community pool—they face funny challenges, like convincing a grumpy neighbor to part with his lawnmower. On race day, with their quirky creation, they realize the true victory isn't about winning, but the fun and creativity they shared while building it.",
  },
  {
    id: 41,
    title: "The Puzzle of the Painted Door ",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/puzzle_of_painted_door.jpg"),
    summary:
      "When Maya discovers an old, colorful door in her attic, she is immediately drawn to it. However, it’s locked tight with no key in sight. Determined to uncover what lies behind the door, Maya enlists the help of her best friend, Sam. Together, they notice that the intricate patterns on the door resemble a series of puzzles scattered throughout their town. As they solve each puzzle—a riddle at the library, a math challenge at the park, and a treasure hunt in the town square—they uncover clues about the door’s origin. With each discovery, they learn to think outside the box and use their unique strengths. Will they finally unlock the door and reveal its secret, or will it remain a mystery forever?",
  },
  {
    id: 42,
    title: "The Quest to Save the Great Oak Tree",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/save_great_oak_tree.jpg"),
    summary:
      "In the heart of the enchanted forest, a clever young squirrel named Nutty discovers that the Great Oak Tree, which protects all the creatures, is beginning to wither. Determined to save it, Nutty teams up with an unlikely group of friends: a shy rabbit, a grumpy owl, and a mischievous fox. Together, they must solve puzzles, face tricky challenges, and uncover hidden secrets. But time is running out—will they find the mysterious cure in time, or will the forest fall into darkness?",
  },
  {
    id: 43,
    title: "The Puzzle of the Midnight Bridge",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/puzzle_midnight_bridge.jpg"),
    summary:
      "One foggy evening, a young inventor named Max is called to solve a mysterious problem—an ancient bridge that only appears at midnight is blocking the way to a hidden village. The catch? No one knows how to cross it safely. With the help of his loyal dog, Spark, Max discovers that the bridge is full of strange puzzles and shifting patterns that must be solved before the clock strikes one. As midnight draws near, Max realizes the final challenge will test more than his cleverness—will he and Spark be able to outsmart the bridge before it disappears into the fog forever?",
  },
  {
    id: 44,
    title: "The Lost Key of Star Island",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/lost_key.jpg"),
    summary:
      "When a young explorer named Lily finds an old map leading to Star Island, she believes it's the perfect adventure. But when she arrives, she discovers that the island's treasure chest is locked with a mysterious keyhole—one that no one seems to know how to open. With only her wits, a magical compass, and the help of a playful parrot, Lily must unravel riddles, decipher clues, and outsmart tricky obstacles. But as night falls, the key to the treasure is closer than ever... if only she can solve the last puzzle before it's too late!",
  },
  {
    id: 45,
    title: "The Puzzle of the Ancient Tower",
    theme: "Problem-Solving",
    image: require("../../assets/images/browse-page-images/puzzle_ancient_towers.jpeg"),
    summary: "Ella and her best friend Max find an old, crumbling tower at the edge of their town, rumored to hold a mysterious puzzle that no one has ever solved. Intrigued, they decide to take on the challenge. The tower is filled with rooms, each locked by a different puzzle that tests their logic, memory, and teamwork. As they progress, they encounter riddles, shifting walls, and strange symbols, but each clue they solve brings them closer to the tower's secret. Along the way, they learn that the best solutions often come when they combine their strengths and think outside the box. Will Ella and Max be able to crack the final puzzle, or will the tower’s mystery remain unsolved forever?"
  },
  {
    id: 46,
    title: "The Mystery of the Hidden Treasure",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/mystery_hidden_treasure.jpg"),
    summary:
      "One bright morning, Leo, Mia, Mom, and Dad stumbled upon an old map tucked away in their attic. The map had strange markings and a note: “Only the bravest can find the hidden treasure.” With Leo leading the way and Mia reading the clues, the family set off on an adventure across town—from the tallest tree in the park to the spooky garden shed. Each clue brought them closer… but just as they thought they’d found the final clue, a shadow appeared! What could it be?",
  },
  {
    id: 47,
    title: "The Secret of the Shape-Shifting House",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/shape_shifting_house.jpg"),
    summary:
      "Meet Ava, a clever inventor, her mischievous little brother Max, their grandpa who loves telling wild stories, and Grandma, who always has a secret up her sleeve. One evening, Grandma revealed something amazing: their house could change shape! With a twist of a special doorknob, the living room transformed into a jungle filled with vines, the kitchen turned into a pirate ship, and the basement… well, nobody knew what was down there. The family decided to explore each room, finding clues about the house’s magical origins. But when they turned the final knob, the house began to rumble, revealing a doorway they’d never seen before… where could it lead?",
  },
  {
    id: 48,
    title: "The Night of the Floating Lanterns",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/floating_lanterns.jpg"),
    summary:
      "The Patel family—Amara, her big sister Neela, and their dad, who owned a small boat—were all getting ready for the annual Floating Lantern Festival. It was a special tradition where families would place lanterns in the river to honor loved ones. But this year was different. As Amara and Neela set their lanterns afloat, they noticed something magical. One lantern began to glow brightly, drifting upstream against the current. The sisters and their dad decided to follow it, paddling quietly through the misty water. The lantern seemed to be leading them somewhere… to a hidden island no one had ever seen before. What secret could be waiting for them there?",
  },
  {
    id: 49,
    title: "The Big Sibling Secret Mission",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/big_sibling_secret_mission.jpg"),
    summary:
      "Eli had always been the hero of the house—the best at building forts and the fastest on his bike. But when his parents brought home a new baby sister, everything changed. Suddenly, everyone was too busy for adventures. One night, as his sister stared up at him with curious eyes, Eli had a brilliant idea: “Secret Mission: Super Sibling.” He would teach her everything he knew! From fort-building to snack-sneaking, he’d make her the perfect sidekick. But soon Eli realized his sister had a few surprises of her own. Could they really become the ultimate sibling team?",
  },
  {
    id: 50,
    title: "The Family Treehouse Mystery",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/family_treehouse_mystery.jpg"),
    summary:
      "The Harris family—Mom, Dad, and their two kids, Zoe and Jack—had just built the coolest treehouse in their backyard. But something wasn’t right. Every morning, the treehouse seemed a little different: a new trinket appeared, the ladder was rearranged, and even the secret door was wide open. Zoe and Jack decided to solve the mystery. They spent days observing, until one night, they caught a glimpse of something strange—a shadowy figure sneaking around the treehouse. Who could it be? And what did they want with their family’s secret hideaway?",
  },
  {
    id: 51,
    title: "The Family Compass",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/family_compass.jpg"),
    summary: "When Lily and her brother, Ethan, find an old brass compass in their father’s attic, they have no idea it holds the key to an adventure that will bring their family closer than ever before. The compass once belonged to their great-grandfather, a sailor who traveled the world, and it’s said to point the way to something precious hidden in their family’s past. As Lily, Ethan, and their parents follow the compass’s mysterious directions, they discover hidden family stories, forgotten places, and lessons about love, trust, and the importance of sticking together. In the end, they realize the true treasure isn’t the destination—it’s the journey they’ve taken as a family."
  },
  {
    id: 52,
    title: "The Family Quilt",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/family_quilt.jpeg"),
    summary: "Every year, the Bennett family gathers for a reunion, but this time, things are different. Lily, the youngest, is determined to make it special by finishing the family quilt her grandmother started years ago. The quilt holds pieces of their family’s story, with each patch representing a moment from the past—trips, milestones, and cherished memories. With the help of her cousins, aunt, and uncle, Lily sets out to collect the missing patches scattered throughout their hometown. As the quilt comes together, so does the understanding of the family’s rich history, reminding them all that family is the thread that ties them together."
  },
  {
    id: 53,
    title: "The Garden of Memories",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/garden_memories.jpeg"),
    summary: "Every summer, Mia and her family visit their grandmother’s house in the countryside. This year, when they arrive, Mia discovers that her grandmother’s beloved garden is withering. Determined to help, Mia and her parents begin working together to bring the garden back to life. As they plant new flowers, pull weeds, and repair broken fences, they uncover stories from their family’s past hidden within the garden’s blossoms. Each plant tells a tale of love, loss, and growing together. By the end of the summer, Mia realizes that the garden isn’t just a place to grow flowers—it’s a place where their family’s memories continue to bloom."
  },
  {
    id: 54,
    title: "Grandma's Secret Recipe",
    theme: "Family",
    image: require("../../assets/images/browse-page-images/grandma_secret_recipe.jpg"),
    summary: "Sophie loved spending weekends at Grandma Lily’s house, especially when it was time to bake. One rainy afternoon, Grandma decided it was the perfect day to teach Sophie her secret recipe for the most delicious cinnamon rolls. As they measured flour, cracked eggs, and mixed the dough, Grandma shared stories from her own childhood, telling Sophie how baking was always a special way to connect with family. But when the dough doesn’t rise as expected, Sophie starts to worry the recipe might be ruined. With Grandma's patience and a bit of creativity, they come up with a new solution. By the end of the day, not only do they bake the most amazing cinnamon rolls, but Sophie discovers that the true secret recipe isn’t just the ingredients—it’s the love and memories passed down with every batch."
  }
];

const BrowseScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [orderedGenres, setOrderedGenres] = useState(genres);
  const [userThemes, setUserThemes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'info'
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const email = await AsyncStorage.getItem('user_email');
        console.log('Fetching preferences for email:', email);
    
        if (!email) {
          console.log('No user email found in AsyncStorage');
          return;
        }
    
        const token = await AsyncStorage.getItem('jwt_token');
        console.log('Token retrieved:', token ? 'Yes' : 'No');
    
        const response = await fetch(`${API_URL}/browse/get-preferences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email })
        });
    
        console.log('API Response status:', response.status);
        const responseText = await response.text();
        console.log('API Response text:', responseText);
    
        if (response.ok) {
          const data = JSON.parse(responseText);
          console.log('Parsed data:', data);
          const themes = data.themes;
          console.log('Retrieved themes:', themes);
    
          if (themes && themes.length > 0) {
            setUserThemes(themes);
            console.log('Set user themes to:', themes);
    
            const reorderedGenres = [
              ...themes.filter(theme => genres.includes(theme)),
              ...genres.filter(genre => !themes.includes(genre))
            ];
            console.log('Reordered genres:', reorderedGenres);
            setOrderedGenres(reorderedGenres);
          } else {
            console.log('No themes found in response');
          }
        } else {
          console.error('API request failed:', response.status, responseText);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchUserPreferences();
  }, []);

  const getTopPicks = () => {
    console.log('Getting top picks. User themes:', userThemes);  // Debug log
    
    if (!userThemes?.length) {
      console.log('No user themes available');  // Debug log
      return [];
    }
    
    const booksPerTheme = 6;
    
    const topPicks = userThemes.reduce((acc, theme) => {
      const themeBooks = books.filter(book => book.theme === theme);
      console.log(`Found ${themeBooks.length} books for theme ${theme}`);  // Debug log
      
      const shuffled = [...themeBooks].sort(() => 0.5 - Math.random());
      const selectedBooks = shuffled.slice(0, booksPerTheme);
      
      return [...acc, ...selectedBooks];
    }, []);
    
    return topPicks.sort(() => 0.5 - Math.random());
  };

  const showNotification = (message, type = 'info') => {
    setNotification({
      visible: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false
    }));
  };

  const routeToStory = async () => {
    try {
      setModalVisible(false);
      setIsGenerating(true);
      showNotification('Generating your story. This may take a moment...', 'loading');

      // Get authentication data
      const token = await AsyncStorage.getItem('jwt_token');
      const email = await AsyncStorage.getItem('user_email');

      if (!token || !email) {
        showNotification('Please log in to continue.', 'error');
        setTimeout(() => {
          hideNotification();
          router.replace('/(auth)/login');
        }, 2000);
        return;
      }

      const startResponse = await fetch(`${API_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          message: selectedBook.summary
        }),
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start story generation');
      }

      // Then immediately generate the full story
      const generateResponse = await fetch(`${API_URL}/chatbot/generate-story`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate story');
      }

      const storyData = await generateResponse.json();
      
      // Store the generated story data
      await AsyncStorage.setItem('current_story', JSON.stringify({
        ...storyData,
        title: selectedBook.title
      }));

      hideNotification();
      // Navigate to read screen
      router.push('/read');

    } catch (error) {
      console.error('Error generating story:', error);
      showNotification('Failed to generate story. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageClick = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    if (!isGenerating) {
      setModalVisible(false);
      setSelectedBook(null);
    }
  };

  const renderBookList = ({ data, title, style = {} }) => (
    <View style={[styles.genreSection, style]}>
      <Text style={styles.genreTitle}>{title}</Text>
      <FlatList
        horizontal
        data={data}
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
  );

  return (
    <ScrollView style={styles.container}>
      {userThemes.length > 0 && (
        renderBookList({
          data: getTopPicks(),
          title: "Top Picks for You",
          style: styles.topPicksSection
        })
      )}

      {orderedGenres.map((genre) => (
        <View key={genre} style={styles.genreSection}>
          <Text style={styles.genreTitle}>{genre}</Text>
          <FlatList
            horizontal
            data={books.filter(book => book.theme === genre)}
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
              <TouchableOpacity 
                onPress={handleCloseModal} 
                style={styles.closeButton}
                disabled={isGenerating}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{selectedBook.title}</Text>
              <Text style={styles.modalTheme}>Theme: {selectedBook.theme}</Text>
              <Text style={styles.modalSummary}>{selectedBook.summary}</Text>
              
              <TouchableOpacity 
                style={[
                  styles.startReadingButton,
                  isGenerating && styles.disabledButton
                ]}
                onPress={routeToStory}
                disabled={isGenerating}
              >
                <Text style={styles.startReadingButtonText}>
                  {isGenerating ? 'Generating...' : 'Start Reading'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Notification Modal */}
      <NotificationModal 
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  genreSection: {
    marginBottom: 20,
  },
  topPicksSection: {
    marginBottom: 30,
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 10,
  },
  genreTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookContainer: {
    width: 155,
    height: 200,
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
    position: "relative",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  },
  notificationModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    maxWidth: 300,
    width: '90%',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      default: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  notificationSpinner: {
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  notificationButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  notificationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  startReadingButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  startReadingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default BrowseScreen;
