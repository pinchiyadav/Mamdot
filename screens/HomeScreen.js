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
import { Linking } from "react-native";


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
      headerLeft: () => <Text>Mamdot</Text>,
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
          <Ionicons
          onPress={() => {
            // Open maps with the specified location
            Linking.openURL("https://www.google.com/maps?q=WJ82+WM+Firozpur,+Punjab");
          }}
            name="location-outline"
            size={24}
            color="black"
          />

          <Pressable>
            <Animated.Text
              
            >
              <Text></Text>
            </Animated.Text>
          </Pressable>
        </Pressable>
      ),
    });
  }, [selectedCity]);
  
  return (
    <View>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={Header}
        data={sortedData}
        renderItem={({ item, index }) => <MovieCard item={item} key={index} />}
      />
      
      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
