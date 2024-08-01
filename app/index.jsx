//index.jsx
import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Howdy</Text>
      <Link href="/landing" style={styles.link}>Go to Landing Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  link: {
    marginTop: 20,
    color: '#6200ea',
  },
});
