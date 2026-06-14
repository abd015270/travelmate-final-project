import { useContext } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../context/AuthContext";

import { LanguageContext } from "../context/LanguageContext";

import LoginScreen from "../screens/LoginScreen";

import RegisterScreen from "../screens/RegisterScreen";

import HomeScreen from "../screens/HomeScreen";

import TripsScreen from "../screens/TripsScreen";

import FavoritesScreen from "../screens/FavoritesScreen";

import BookingsScreen from "../screens/BookingsScreen";

import ProfileScreen from "../screens/ProfileScreen";

import AdminScreen from "../screens/AdminScreen";

import ExpiredTripsScreen from "../screens/ExpiredTripsScreen";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function UserTabs() {
  const { t } = useContext(LanguageContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={t.home} component={HomeScreen} />

      <Tab.Screen name={t.trips} component={TripsScreen} />

      <Tab.Screen name={t.favorites} component={FavoritesScreen} />

      <Tab.Screen name={t.bookings} component={BookingsScreen} />

      <Tab.Screen name={t.profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  const { t } = useContext(LanguageContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Admin" component={AdminScreen} />

      <Tab.Screen name="Expired" component={ExpiredTripsScreen} />

      <Tab.Screen name={t.profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <AuthStack />;
  }

  if (user.role === "admin") {
    return <AdminTabs />;
  }

  return <UserTabs />;
}