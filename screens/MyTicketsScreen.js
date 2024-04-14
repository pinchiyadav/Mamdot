import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MyTicketsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTickets);
    return unsubscribe;  // Clean up the listener when the component unmounts
  }, [navigation]);

  const loadTickets = async () => {
    try {
      const storedTickets = await AsyncStorage.getItem('tickets');
      if (storedTickets) {
        const ticketsArray = JSON.parse(storedTickets);
        setTickets(ticketsArray);
      } else {
        console.log('No tickets found in storage.');
      }
    } catch (err) {
      console.error("Failed to load tickets from AsyncStorage", err);
      Alert.alert("Load Error", "Failed to load tickets.");
    }
  };

  const handlePress = (ticket) => {
    // Navigate to the TicketScreen with details
    navigation.navigate('Ticket', ticket);
  };

  const clearTickets = async () => {
    try {
      await AsyncStorage.removeItem('tickets');
      setTickets([]);  // Clear the state to update UI
      Alert.alert('Success', 'All tickets have been cleared.');
    } catch (err) {
      console.error("Failed to clear tickets", err);
      Alert.alert('Error', 'Failed to clear tickets.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Seats: {item.selectedSeats}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.showtime}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No tickets saved.</Text>}
      />
      <Pressable style={styles.button} onPress={clearTickets}>
        <Text style={styles.buttonText}>Clear All Tickets</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  item: {
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'grey'
  }
});

export default MyTicketsScreen;
