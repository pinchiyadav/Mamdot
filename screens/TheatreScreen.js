import React, { useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const TheatreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedSeats, setSelectedSeats] = useState([]);

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
  const seatNumbers = selectedSeats.map((seat) => seat.row + seat.seat);

  const result = seatNumbers.join(" ");
  const renderSeats = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                            ]}
                            disabled={isBooked}
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
          {/* Screen indicator */}
          <View style={styles.screenIndicator}>
            <View style={styles.screenLine} />
            <Text style={styles.screenText}>SCREEN THIS WAY</Text>
          </View>
        </View>
      </ScrollView>
    );
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
  console.log(selectedSeats);
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
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>

        {renderSeats()}

        <View
          style={{
            backgroundColor: "#D8D8D8",
            padding: 10,
            marginTop: 25,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 100,
            gap: 30,
          }}
        >
          <View>
            <FontAwesome
              style={{ textAlign: "center", marginBottom: 4 }}
              name="square"
              size={24}
              color="#ffc40c"
            />
            <Text>selected</Text>
          </View>

          <View>
            <FontAwesome
              style={{ textAlign: "center", marginBottom: 4 }}
              name="square"
              size={24}
              color="white"
            />
            <Text>Vacant</Text>
          </View>

          <View>
            <FontAwesome
              style={{ textAlign: "center", marginBottom: 4 }}
              name="square"
              size={24}
              color="gray"
            />
            <Text>Booked</Text>
          </View>
        </View>

        {/* <Pressable
          style={{
            marginTop: 50,
            backgroundColor: "#E0E0E0",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>selected Seats</Text>
          <Pressable onPress={pay}>
            <Text>PAY 100</Text>
          </Pressable>
        </Pressable> */}
      </ScrollView>

      {selectedSeats.length > 0 ? (
        <Pressable
          style={{
            backgroundColor: "#FEBE10",
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{fontSize:15,fontWeight:"500"}}>
            {selectedSeats.length} seat's selected {result}
          </Text>
          <Pressable onPress={pay}>
            <Text style={{fontSize:15,fontWeight:"500"}}>Proceed</Text>
          </Pressable>
        </Pressable>
      ) : (
        <Pressable style={{ backgroundColor: "#D3D3D3", padding: 20 }}>
          <Text style={{textAlign:"center"}}>0 SEATS SELECTED</Text>
        </Pressable>
      )}
    </>
  );
};

export default TheatreScreen;

const styles = StyleSheet.create({
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});
