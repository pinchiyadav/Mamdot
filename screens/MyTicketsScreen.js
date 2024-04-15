import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MyTicketsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTickets);
    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={clearTickets} style={{ paddingRight: 10 }}>
          <Text>Clear</Text>
        </TouchableOpacity>
      ),
      title: 'My Tickets',
    });
  }, [navigation, clearTickets]);

  const loadTickets = async () => {
    try {
      const storedTickets = await AsyncStorage.getItem('tickets');
      if (storedTickets) {
        const ticketsArray = JSON.parse(storedTickets);
        setTickets(ticketsArray.reverse()); // Reverse the order of tickets
      } else {
        console.log('No tickets found in storage.');
      }
    } catch (err) {
      console.error("Failed to load tickets from AsyncStorage", err);
      Alert.alert("Load Error", "Failed to load tickets.");
    }
  };
  

  const clearTickets = async () => {
    try {
      Alert.alert(
        'Confirm',
        'Are you sure you want to clear all tickets?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Clear',
            onPress: async () => {
              await AsyncStorage.removeItem('tickets');
              setTickets([]);
              Alert.alert('Success', 'All tickets have been cleared.');
            }
          }
        ]
      );
    } catch (err) {
      console.error("Failed to clear tickets", err);
      Alert.alert('Error', 'Failed to clear tickets.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.label}>Seats: <Text style={styles.seats}>{item.selectedSeats.join(' | ')}</Text></Text>
      <Text style={styles.label}>Date: {item.date}</Text>
      <Text style={styles.label}>Time: {item.showtime}</Text>
    </TouchableOpacity>
  );

  const handlePress = (ticket) => {
    navigation.navigate('Ticket', ticket);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No tickets saved.</Text>}
      />
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
  label: {
    color: 'gray'
  },
  seats: {
    color: 'red'
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'grey'
  }
});

export default MyTicketsScreen;
