import React, { useLayoutEffect, useState, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const TheatreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userType, setUserType] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  console.log(route.params);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          <Text>{route.params.mall}</Text>
        </Pressable>
      ),
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#F5F5F5",
        shadowColor: "transparent",
        shadowOpacity: 0.3,
        shadowOffset: { width: -1, height: 1 },
        shadowRadius: 3,
      },
    });
  }, []);

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleSeatPress = (row, seat) => {
    console.log("row", row);
    console.log("seat", seat);

    const isSelected = selectedSeats.some(
      (selectedSeat) => selectedSeat.row === row && selectedSeat.seat === seat
    );

    if (isSelected) {
      setSelectedSeats((prevState) =>
        prevState.filter(
          (selectedSeat) =>
            selectedSeat.row !== row || selectedSeat.seat !== seat
        )
      );
    } else {
      setSelectedSeats((prevState) => [...prevState, { row, seat }]);
    }
  };

  const renderSeats = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        pinchGestureEnabled={true}
        maximumZoomScale={2} // You can adjust the maximum zoom scale here
        minimumZoomScale={0.5} // You can adjust the minimum zoom scale here
        automaticallyAdjustContentInsets={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          {route.params.rows.map((row, rowIndex) => {
            let labelContent = '';
            let labelStyle = styles.seatLabel;
            if (row.row === 'A') {
              labelContent = "RECLINER - Rs. 450";
            } else if (row.row === 'B') {
              labelContent = "DIAMOND - Rs. 400";
              labelStyle = [styles.seatLabel, { marginTop: 10 }];
            } else if (row.row === 'E') {
              labelContent = "PLATINUM - Rs. 350";
            }

            const isRowDisabled =
              (userType === "User2" && ["A", "B", "C", "D"].includes(row.row)) ||
              (userType === "User3" && ["A", "B", "C", "D", "E", "F"].includes(row.row)) ||
              userType === null;

            return (
              <View key={rowIndex}>
                {labelContent !== '' && (
                  <Text style={labelStyle}>
                    {labelContent}
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ width: 30, marginRight: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
                      {row.row}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {row.seats.map((seat, seatIndex) => {
                      const isLastSeatInRowB = seatIndex === 4 && row.row === 'B';
                      const isLastSeatInRowA = seatIndex === 8 && row.row === 'A';
                      const separator = isLastSeatInRowA ? <View style={{ width: 0 }}/> : isLastSeatInRowB ? <View style={{ width: 420 }}/> : seatIndex === 8 ? <View style={{ width: 20 }}/> : null;
                      const isBooked = seat.bookingStatus === "disabled";
                      return (
                        <React.Fragment key={seatIndex}>
                          {separator}
                          <Pressable
                            onPress={() => !isBooked && handleSeatPress(row.row, seat.number)}
                            style={[
                              styles.seat,
                              selectedSeats.some(
                                (selectedSeat) =>
                                  selectedSeat.row === row.row &&
                                  selectedSeat.seat === seat.number
                              ) && styles.selectedSeat,
                              isBooked && styles.bookedSeat,
                              isRowDisabled && styles.disabledSeat,
                            ]}
                            disabled={isBooked || isRowDisabled}
                          >
                            <Text>{seat.number}</Text>
                          </Pressable>
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
              </View>
            );
          })}
          <View style={styles.screenIndicator}>
            <View style={styles.screenLine} />
            <Text style={styles.screenText}>SCREEN THIS WAY</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const pay = () => {
    navigation.navigate("Confirm", {
      mall: route.params.mall,
      showtime: route.params.showtime,
      name: route.params.name,
      selectedDate: route.params.selectedDate,
      seats: result,
      rows: route.params.rows,
      selectedSeats: selectedSeats,
      docId: route.params.docId,
    });
    console.log(route.params);
  };

  const seatNumbers = selectedSeats.map((seat) => seat.row + seat.seat);
  const result = seatNumbers.join(" ");

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.userTypeContainer}>
        <Pressable style={userType === "User1" ? styles.selectedUserButton : styles.userButton} onPress={() => handleUserTypeSelect("User1")}>
          <Text>User 1</Text>
        </Pressable>
        <Pressable style={userType === "User2" ? styles.selectedUserButton : styles.userButton} onPress={() => handleUserTypeSelect("User2")}>
          <Text>User 2</Text>
        </Pressable>
        <Pressable style={userType === "User3" ? styles.selectedUserButton : styles.userButton} onPress={() => handleUserTypeSelect("User3")}>
          <Text>User 3</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        {renderSeats()}

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <FontAwesome
              style={styles.legendIcon}
              name="square"
              size={24}
              color="#ffc40c"
            />
            <Text>selected</Text>
          </View>

          <View style={styles.legendItem}>
            <FontAwesome
              style={styles.legendIcon}
              name="square"
              size={24}
              color="white"
            />
            <Text>Vacant</Text>
          </View>

          <View style={styles.legendItem}>
            <FontAwesome
              style={styles.legendIcon}
              name="square"
              size={24}
              color="gray"
            />
            <Text>Booked</Text>
          </View>
        </View>
      </ScrollView>

      {selectedSeats.length > 0 ? (
        <Pressable
          style={styles.footerButton}
          onPress={pay}
        >
          <Text style={styles.footerButtonText}>
            {selectedSeats.length} seat's selected {result}
          </Text>
          <Text style={styles.footerButtonText}>Proceed</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.footerButton}>
          <Text style={styles.footerButtonText}>0 SEATS SELECTED</Text>
        </Pressable>
      )}
    </View>
  );
};

export default TheatreScreen;

const styles = StyleSheet.create({
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  userButton: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedUserButton: {
    backgroundColor: "#FEBE10",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  seat: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#C0C0C0",
  },
  selectedSeat: {
    backgroundColor: "#FFD700",
    borderColor: "transparent",
  },
  bookedSeat: {
    backgroundColor: "#989898",
    borderColor: "transparent",
  },
  seatLabel: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  screenIndicator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  screenLine: {
    width: '60%',
    height: 1,
    backgroundColor: 'black',
    marginTop: 50,
    marginBottom: 10,
  },
  screenText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    color: "gray",
    marginBottom: 20,
  },
  legendContainer: {
    backgroundColor: "#D8D8D8",
    padding: 10,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  legendItem: {
    alignItems: "center",
  },
  legendIcon: {
    textAlign: "center",
    marginBottom: 4,
  },
  footerButton: {
    backgroundColor: "#FEBE10",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  disabledSeat: {
    opacity: 0.5,
  },
});
