import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Alert,
  BackHandler
} from 'react-native';
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import SvgQRCode from "react-native-qrcode-svg";

const TicketScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const ticketPrice = route.params.seats.length * 220;
  const fee = 87;
  const grandTotal = ticketPrice + fee;
  const { TicketId, viewerNames, name, date, phoneNo } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false
    });
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Want to end Session",
        "Go back to main screen",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] }),
          }
        ]
      );
      return true;  // Returning true prevents the event from bubbling up
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();  // Correctly clean up the listener
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={styles.ticketContainer}>
        <View style={styles.headerContainer}>
          <Text>{route.params.mall}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.boldText}>Movie</Text>
          <Text style={styles.boldText}>{name}</Text>
        </View>

        

        <Text style={styles.dashedLine}/>

        <View style={styles.sectionMargin}>
          <View style={styles.detailRow}>
            <Text>Date</Text>
            <Text style={styles.grayText}>
              {date}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Time</Text>
            <Text style={styles.grayText}>
              {route.params.showtime}
            </Text>
          </View>
        </View>

        

        

        <Text style={styles.dashedLine}/>

        <View style={styles.sectionMargin}>
        
          <View style={styles.detailRow}>
            <Text>Tickets</Text>
            <Text style={styles.grayText}>
              {route.params.seats.length}
            </Text>
          </View>
        </View>

        <View style={styles.sectionMargin}>
          <View style={styles.detailRow}>
            <Text>SEATS</Text>
            <Text style={{ color: "red", marginTop: 4, fontWeight: "500" }}>
  {route.params.selectedSeats.join(" | ")}
</Text>
          </View>
        </View>

        <Text style={styles.dashedLine}/>
        <View style={styles.sectionMargin}>
        <View style={styles.detailRow}>
          <Text>Phone No</Text>
          <Text style={styles.grayText}>{phoneNo}</Text>
        </View>
        </View>
        <Text style={styles.dashedLine}/>

        

        <View style={styles.priceDetailContainer}>
  
  {/* Viewer Names and Seats */}
  <View style={{ marginHorizontal: 10, marginTop: 7 }}>
    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "white" }}>
      Viewers
    </Text>
    {viewerNames.map((name, index) => (
      <View key={index} style={styles.detailRow}>
        <Text style={{ fontSize: 15, color: "white" }}>
          Seat {route.params.selectedSeats[index]}
        </Text>
        <Text style={{ fontSize: 15, color: "white" }}>
          {name}
        </Text>
      </View>
    ))}
  </View>
</View>



        <View style={styles.centerAlign}>
          <SvgQRCode value={TicketId}/>
        </View>

        <Text style={styles.centerText}>{TicketId}</Text>
        <Text style={styles.dashedLine}/>

        <Pressable
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] })}
          style={styles.returnButton}
        >
          <Text style={styles.returnButtonText}>
            Return
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default TicketScreen;

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
    backgroundColor: "#FF6347",
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
    backgroundColor: "#FF6347",
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  returnButtonText: { color: "white", textAlign: "center", fontWeight: "500" },
});
