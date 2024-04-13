import React, { useLayoutEffect, useState, useContext, useEffect } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Calendar from "../components/Calendar";
import moment from "moment";
import { Place } from "../PlaceContext";
import { client } from "../pvr-movies/sanity";

const MovieScreen = () => {
  const navigation = useNavigation();
  const { locationId } = useContext(Place);
  const route = useRoute();
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  const [reqData, setReqData] = useState([]);
  const [expandedTheaters, setExpandedTheaters] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
      headerStyle: {
        backgroundColor: "#F5F5F5",
        shadowColor: "transparent",
        shadowOpacity: 0.3,
        shadowOffset: { width: -1, height: 1 },
        shadowRadius: 3,
      },
    });
  }, [navigation, route.params.title]);

  useEffect(() => {
    const fetchTheatres = async () => {
      const response = await client.fetch(
        `*[_type == "theatre" && location._ref == "${locationId}"]{
          ...,
          "showtimes": *[_type == 'showtimes' && time != "" && date == "${selectedDate}" && references(^._id) && references('movie', "${route.params.movieId}")]{
            _id,
            time,
            row,
            "theatre": theatre->name,
            "movie": movie->name,
            date
          }
        }`
      );
      setReqData(response);
      // Automatically expand all theaters to show showtimes by default
      setExpandedTheaters(response.map((theatre) => theatre.name));
    };
    fetchTheatres();
  }, [selectedDate, locationId, route.params.movieId]); // Add selectedDate to dependencies array

  return (
    <View>
      <ScrollView contentContainerStyle={{ marginLeft: 10 }}>
        <Calendar selected={selectedDate} onSelectDate={setSelectedDate} />
      </ScrollView>

      {reqData.map((theatre, index) => (
        <View key={index}>
          <Pressable
            onPress={() =>
              setExpandedTheaters(
                expandedTheaters.includes(theatre.name)
                  ? expandedTheaters.filter((name) => name !== theatre.name)
                  : [...expandedTheaters, theatre.name]
              )
            }
            style={{ marginHorizontal: 20, marginVertical: 10 }}
          >
            <Text style={{ fontSize: 15, fontWeight: "500" }}>{theatre.name}</Text>
          </Pressable>
          {expandedTheaters.includes(theatre.name) && (
            <FlatList
              numColumns={3}
              data={theatre.showtimes}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Theatre", {
                      showtime: item.time,
                      name: route.params.title,
                      selectedDate: selectedDate,
                      rows: item.row,
                      docId: item._id,
                    })
                  }
                  style={{
                    borderColor: "green",
                    borderWidth: 0.7,
                    padding: 5,
                    width: 80,
                    borderRadius: 5,
                    margin: 8,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "green",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    {item.time}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default MovieScreen;
