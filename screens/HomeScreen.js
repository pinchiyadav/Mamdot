import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "../PlaceContext";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Header from "../components/Header";
import { Foundation } from "@expo/vector-icons";
import { BottomModal } from "react-native-modals";
import { ModalFooter } from "react-native-modals";
import { ModalTitle } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { ModalContent } from "react-native-modals";
import "url-search-params-polyfill";
import {URL} from "react-native-url-polyfill"
import { client } from "../pvr-movies/sanity";

const HomeScreen = () => {
  global.URL = URL;
  const params = new URLSearchParams();
  params.set("foo", "bar");
  const navigation = useNavigation();
  
  const { selectedCity, setSelectedCity } = useContext(Place);
  console.log(selectedCity)
  const moveAnimation = new Animated.Value(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState();
  const [moviesData,setMoviesData]  = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await client.fetch(`
      *[_type == "movie"]
      `)
      setMoviesData(result);
      setSortedData(result);
    }
    fetchData();
  },[])

  console.log(moviesData)
  useEffect(() => {
    Animated.loop(
      Animated.timing(moveAnimation, {
        toValue: -30,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [selectedCity]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Text>Hello Sujan Anand</Text>,
      headerStyle: {
        backgroundColor: "#F5F5F5",
        shadowColor: "transparent",
        shadowOpacity: 0.3,
        shadowOffset: { width: -1, height: 1 },
        shadowRadius: 3,
      },
      headerRight: () => (
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Ionicons
            onPress={() => navigation.navigate("Places")}
            name="location-outline"
            size={24}
            color="black"
          />

          <Pressable onPress={() => navigation.navigate("Places")}>
            <Animated.Text
              style={[
                styles.text,
                { transform: [{ translateX: moveAnimation }] },
              ]}
            >
              <Text>{selectedCity}</Text>
            </Animated.Text>
          </Pressable>
        </Pressable>
      ),
    });
  }, [selectedCity]);
  const languages = [
    {
      id: "0",
      language: "English",
    },
    {
      id: "10",
      language: "Kannada",
    },
    {
      id: "1",
      language: "Telugu",
    },
    {
      id: "2",
      language: "Hindi",
    },
    {
      id: "3",
      language: "Tamil",
    },
    {
      id: "5",
      language: "Malayalam",
    },
  ];
  const genres = [
    {
      id: "0",
      language: "Horror",
    },
    {
      id: "1",
      language: "Comedy",
    },
    {
      id: "2",
      language: "Action",
    },
    {
      id: "3",
      language: "Romance",
    },
    {
      id: "5",
      language: "Thriller",
    },
    {
      id: "6",
      language: "Drama",
    },
  ];
  const applyFilter = (filter) => {
    setModalVisible(false);
    switch (filter) {
      case "English":
        setSortedData(
          sortedData.filter((item) => item.original_language === selectedFilter)
        );
        break;
      case "Kannada":
        setSortedData(
          sortedData.filter((item) => item.original_language === selectedFilter)
        );
        break;
      case "Telugu":
        setSortedData(
          sortedData.filter((item) => item.original_language === selectedFilter)
        );
        break;
      case "Hindi":
        setSortedData(
          sortedData.filter((item) => item.original_language === selectedFilter)
        );
        break;
      case "Tamil":
        setSortedData(
          sortedData.filter((item) => item.original_language === selectedFilter)
        );
        break;
      case "Malayalam":
        setSortedData(
          sortedData.filter((item) => item.original_language === selectedFilter)
        );
        break;
    }
  };
  return (
    <View>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={Header}
        data={sortedData}
        renderItem={({ item, index }) => <MovieCard item={item} key={index} />}
      />
      <Pressable
        onPress={() => setModalVisible(!modalVisible)}
        style={{
          position: "absolute",
          bottom: 10,
          backgroundColor: "#ffc40c",
          width: 60,
          height: 60,
          borderRadius: 30,
          right: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Foundation name="filter" size={24} color="black" />
      </Pressable>
      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        footer={
          <ModalFooter>
            <Pressable
              onPress={() => applyFilter(selectedFilter)}
              style={{
                paddingRight: 10,
                marginLeft: "auto",
                marginRight: "auto",
                marginVertical: 10,
                marginBottom: 30,
              }}
            >
              <Text>Apply</Text>
            </Pressable>
          </ModalFooter>
        }
        modalTitle={<ModalTitle title="Filters" />}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 280 }}>
          <Text
            style={{
              paddingVertical: 5,
              fontSize: 15,
              fontWeight: "500",
              marginTop: 10,
            }}
          >
            Languages
          </Text>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {languages.map((item, index) =>
              selectedFilter === item.language ? (
                <Pressable
                  onPress={() => setSelectedFilter()}
                  style={{
                    margin: 10,
                    backgroundColor: "orange",
                    paddingVertical: 5,
                    borderRadius: 25,
                    paddingHorizontal: 11,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    {item.language}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => setSelectedFilter(item.language)}
                  style={{
                    margin: 10,
                    borderColor: "#C8C8C8",
                    borderWidth: 1,
                    paddingVertical: 5,
                    borderRadius: 25,
                    paddingHorizontal: 11,
                  }}
                >
                  <Text>{item.language}</Text>
                </Pressable>
              )
            )}
          </Pressable>

          <Text
            style={{
              paddingVertical: 5,
              fontSize: 15,
              fontWeight: "500",
              marginTop: 10,
            }}
          >
            Genres
          </Text>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {genres.map((item, index) => (
              <Pressable
                style={{
                  margin: 10,
                  borderColor: "#C8C8C8",
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 25,
                  paddingHorizontal: 11,
                }}
              >
                <Text>{item.language}</Text>
              </Pressable>
            ))}
          </Pressable>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
