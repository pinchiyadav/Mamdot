import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/MyTicketsScreen";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import MovieScreen from "../screens/MovieScreen";
import TheatreScreen from "../screens/TheatreScreen";
import FoodScreen from "../screens/FoodScreen";
import Confirmation from "../screens/Confirmation";
import TicketScreen from "../screens/TicketScreen";
import MyTicketsScreen from "../screens/MyTicketsScreen";

const TicketsStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreens() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: "" }} />
      <HomeStack.Screen name="Movie" component={MovieScreen} />
      <HomeStack.Screen name="Theatre" component={TheatreScreen} />
      <HomeStack.Screen name="Confirm" component={Confirmation} />
      <HomeStack.Screen name="Food" component={FoodScreen} />
      <HomeStack.Screen name="Ticket" component={TicketScreen} />

    </HomeStack.Navigator>
  );
}

function MyTicketsStackScreens() {
  return (
    <TicketsStack.Navigator>
      <TicketsStack.Screen name="My Tickets" component={MyTicketsScreen} />
    </TicketsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStackScreens}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="MyTicketsScreen"
          component={MyTicketsStackScreens}
          options={{
            tabBarLabel: "My Tickets",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="ticket" size={24} color="black" />
              ) : (
                <Ionicons name="ticket-outline" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation