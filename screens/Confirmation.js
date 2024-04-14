import {
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { client } from "../pvr-movies/sanity";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [phoneNo, setPhoneNo] = useState("");  // State to store the phone number

  const generateTicketId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ticketId = '';
    for (let i = 0; i < 6; i++) {
      ticketId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ticketId;
  };
  
  const ticketId = generateTicketId();
  const [viewerNames, setViewerNames] = useState(
    route.params.selectedSeats.map(() => '')
  );

  const handleViewerNameChange = (text, index) => {
    const updatedNames = [...viewerNames];
    updatedNames[index] = text;
    setViewerNames(updatedNames);
  };

  const pay = async() => {
    const updatedRows = [...route.params.rows];

    route.params.selectedSeats.forEach((seat, index) => {
      const rowIndex = updatedRows.findIndex((row) => row.row === seat.row);
      const seatIndex = updatedRows[rowIndex].seats.findIndex((s) => s.number === seat.seat);
      const docId = route.params.docId;
      client
        .patch(docId)
        .set({
          [`row[${rowIndex}].seats[${seatIndex}].bookingStatus`]: "disabled",
          [`row[${rowIndex}].seats[${seatIndex}].TicketId`]: ticketId,
          [`row[${rowIndex}].seats[${seatIndex}].viewer`]: viewerNames[index],
          [`row[${rowIndex}].seats[${seatIndex}].PhoneNo`]: phoneNo,
        })
        .commit()
        .then((updatedDoc) => {
          console.log("updated doc: ", updatedDoc)
        }).catch((err) => {
          console.log("update failed", err)
        });

      updatedRows[rowIndex].seats[seatIndex].bookingStatus = "disabled";
    });

    const seatNumbers = route.params.selectedSeats.map((seat) => seat.row + seat.seat);
    const result = seatNumbers.join(" ");
  
    const ticketDetails = {
      TicketId: ticketId,
  selectedSeats: route.params.selectedSeats.map(seat => seat.row + seat.seat),  // Ensure this concatenates correctly
  mall: route.params.mall,
  showtime: route.params.showtime,
  date: route.params.selectedDate,
  name: route.params.name,
  seats: route.params.selectedSeats,  // Assuming this contains objects or proper concatenation
  viewerNames: viewerNames,  // Include viewer names here
  phoneNo: phoneNo,
    };
  
    navigation.navigate("Ticket", ticketDetails);

  
    // Save to AsyncStorage
    try {
      const storedTickets = await AsyncStorage.getItem('tickets');
      const tickets = storedTickets ? JSON.parse(storedTickets) : [];
      tickets.push(ticketDetails);
      await AsyncStorage.setItem('tickets', JSON.stringify(tickets));
      console.log('Tickets saved:', tickets);  // Debug statement
  } catch (err) {
      console.error("Failed to save tickets", err);
  }
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ backgroundColor: "white", padding: 10, borderRadius: 6 }}>
        {/* Movie details */}
        <View>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{route.params.name}</Text>
          <Text style={{ marginVertical: 4, color: "gray" }}>U • A English</Text>
          <Text>{route.params.selectedDate}</Text>
        </View>

        <View style={{ height: 1, borderColor: "#E0E0E0", borderWidth: 1, marginTop: 6 }} />

        {/* Theater details */}
        <View>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{route.params.mall}</Text>
          <Text style={{ fontSize: 15, fontWeight: "500", marginTop: 4, color: "gray" }}>
            AUDI 02 • CLASSIC
          </Text>
          <Text style={{ color: "red", marginTop: 4, fontWeight: "500" }}>
            {route.params.seats} | {route.params.showtime}
          </Text>
        </View>

        <View style={{ height: 1, borderColor: "#E0E0E0", borderWidth: 1, marginTop: 6 }} />
        {/* Add Phone Number Input */}
        <View style={{ marginTop: 10 ,flexDirection: "row", alignItems: "left",}}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>Phone Number:</Text>
          <TextInput
            style={{ backgroundColor: "#E0E0E0", borderRadius: 4, padding: 5, flex: 1, marginLeft: 20 ,marginTop:-3}}
            onChangeText={setPhoneNo}
            value={phoneNo}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Tickets and viewer names entry */}
        <View>
        <View
            style={{
              padding: 0,
              marginTop: 20,
              flexDirection: "row",
              alignItems: "left",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              TICKETS 
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
            {route.params.selectedSeats.length}
            </Text>
          </View>
          {route.params.selectedSeats.map((seat, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'left', justifyContent: 'space-between' , marginTop:20}}>
              <Text style={{ fontSize: 15, fontWeight: "500" }}>
                Seat {seat.row}{seat.seat}:
              </Text>
              <TextInput
                style={{ backgroundColor: "#E0E0E0", borderRadius: 4, padding: 5, flex: 1, marginLeft: 20 ,marginTop:-4}}
                onChangeText={(text) => handleViewerNameChange(text, index)}
                value={viewerNames[index]}
                placeholder="Viewer name"
              />
            </View>
          ))}
        </View>
      </View>

      <Pressable
        style={{
          marginTop: 10,
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={pay}
      >
        <Text style={{ fontSize: 15, fontWeight: "500" }}>Book</Text>
      </Pressable>
    </View>
  );
};

export default ConfirmationScreen;
