import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const options = ['Profile', 'Account', 'Display', 'Sound', 'Notifications'];

const AccountScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => handleOptionPress(option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.details}>
        {selectedOption && (
          <Text style={styles.detailsText}>
            {selectedOption} Details
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '30%',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
  },
  option: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  selectedOption: {
    backgroundColor: '#ececec',
  },
  details: {
    flex: 1,
    padding: 15,
  },
  detailsText: {
    fontSize: 18,
  },
});

export default AccountScreen;
