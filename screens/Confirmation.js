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
  const [viewerNames, setViewerNames] = useState(
    route.params.selectedSeats.map(() => '')
  );

  const generateTicketId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ticketId = '';
    for (let i = 0; i < 6; i++) {
      ticketId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ticketId;
  };

  const ticketId = generateTicketId();

  const handleViewerNameChange = (text, index) => {
    const updatedNames = [...viewerNames];
    updatedNames[index] = text;
    setViewerNames(updatedNames);
  };

  const pay = async () => {
    

    if (viewerNames.some(name => name.trim() === "")) {
      Alert.alert("Error", "Please enter viewer names for all selected seats");
      return;
    }

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



        {/* Theater details */}

        <View style={styles.sectionMargin}>
          <View style={styles.detailRow}>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>{route.params.name}</Text>
            <Text style={{ color: "red", marginTop: 4, fontWeight: "500", marginBottom: 0 }}>
              {route.params.seats} 
            </Text></View>
          <Text style={{ marginVertical: 10, color: "gray" }}>{route.params.selectedDate} | {route.params.showtime}</Text>
        </View>
        <View>

        </View>

        <View style={{ height: 1, borderColor: "#E0E0E0", borderWidth: 1, marginTop: 6 }} />
        {/* Add Phone Number Input */}


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
            <View key={index} style={{ flexDirection: 'row', alignItems: 'left', justifyContent: 'space-between', marginTop: 20 }}>
              <Text style={{ fontSize: 15, fontWeight: "500" }}>
                Seat {seat.row}{seat.seat}:
              </Text>
              <TextInput
                style={{ backgroundColor: "#E0E0E0", borderRadius: 4, padding: 5, flex: 1, marginLeft: 20, marginTop: -4 }}
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
          backgroundColor: "#F84464",
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

const styles = StyleSheet.create({
  ticketContainer: {
    backgroundColor: "white",
    height: "95%",
    margin: 10,
    borderRadius: 6,
  },
  headerContainer: { padding: 10 },
  detailRow: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boldText: { fontSize: 15, fontWeight: "500" },
  redText: { color: "red" },
  dashedLine: {
    borderColor: "#DCDCDC",
    borderWidth: 0.5,
    borderStyle: "dashed",
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    height: 1,
  },
  dateContainer: { marginLeft: 10 },
  dateText: { marginTop: 6, fontSize: 15 },
  logoImage: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  sectionMargin: { marginHorizontal: 10, marginTop: 7 },
  grayText: { color: "gray", fontWeight: "500" },
  priceDetailContainer: {
    backgroundColor: "#F84464",
    borderRadius: 3,
    margin: 10,
    padding: 10,
  },
  whiteText: { fontSize: 15, fontWeight: "500", color: "white" },
  whiteBoldText: { fontWeight: "bold", fontSize: 17, color: "white" },
  centerAlign: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  centerText: { fontSize: 16, fontWeight: "500", textAlign: "center" },
  returnButton: {
    backgroundColor: "#F84464",
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  returnButtonText: { color: "white", textAlign: "center", fontWeight: "500" },
});
