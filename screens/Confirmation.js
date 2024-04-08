import {
    Alert,
    BackHandler,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from "react-native";
  import React, { useEffect, useLayoutEffect } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import { useSelector } from "react-redux";
  import { client } from "../pvr-movies/sanity";
  
  const ConfirmationScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const pay = () => {

        const updatedRows = [...route.params.rows];
    
          route.params.selectedSeats.forEach((seat) => {
            const rowIndex = updatedRows.findIndex((row) => row.row === seat.row);
            console.log("row Index", rowIndex);
            const seatIndex = updatedRows[rowIndex].seats.findIndex(
              (s) => s.number === seat.seat
            );
            console.log("seat Index", seatIndex);
            const docId = route.params.docId;
            client
              .patch(docId)
              .set({
                [`row[${rowIndex}].seats[${seatIndex}].bookingStatus`]: "disabled",
              })
              .commit()
              .then((updatedDoc) => {
                console.log("updated doc: ",updatedDoc)
              }).catch((err) => {
                console.log("update failed",err)
              })
            updatedRows[rowIndex].seats[seatIndex].bookingStatus = "disabled";
    
          const seatNumbers = route.params.selectedSeats.map((seat) => seat.row + seat.seat);
    
          const result = seatNumbers.join(" ");
    
          navigation.navigate("Ticket",{
            selectedSeats: result,
            mall: route.params.mall,
            showtime: route.params.showtime,
            date: route.params.date,
            seats: route.params.selectedSeats,
          })
        });
      };


    console.log(route.params);
    
    return (
      <View style={{ padding: 20 }}>
        <View style={{ backgroundColor: "white", padding: 10, borderRadius: 6 }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              {route.params.name}
            </Text>
            <Text style={{ marginVertical: 4, color: "gray" }}>
              U • A English
            </Text>
            <Text>{route.params.selectedDate}</Text>
          </View>
  
          <View
            style={{
              height: 1,
              borderColor: "#E0E0E0",
              borderWidth: 1,
              marginTop: 6,
            }}
          />
  
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              {route.params.mall}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                marginTop: 4,
                color: "gray",
              }}
            >
              AUDI 02 • CLASSIC
            </Text>
            <Text style={{ color: "red", marginTop: 4, fontWeight: "500" }}>
              {route.params.seats} | {route.params.showtime}
            </Text>
          </View>
  
          <View
            style={{
              height: 1,
              borderColor: "#E0E0E0",
              borderWidth: 1,
              marginTop: 6,
            }}
          />
  
          
  
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
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
        >
          <Text 
          onPress={pay}
          style={{ fontSize: 15, fontWeight: "500" }}>Book</Text>
        </Pressable>
      </View>
    );
  };
  
  export default ConfirmationScreen;
  
  const styles = StyleSheet.create({});
  