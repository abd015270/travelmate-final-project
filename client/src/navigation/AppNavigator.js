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
import AdminUsersScreen from "../screens/AdminUsersScreen";
import ExpiredTripsScreen from "../screens/ExpiredTripsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function UserTabs() {
  const { t } = useContext(LanguageContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t.home }}
      />

      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{ tabBarLabel: t.trips }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: t.favorites }}
      />

      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ tabBarLabel: t.bookings }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t.profile }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  const { t } = useContext(LanguageContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Admin"
        component={AdminScreen}
        options={{ tabBarLabel: t.admin }}
      />

      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{ tabBarLabel: t.users }}
      />

      <Tab.Screen
        name="Expired"
        component={ExpiredTripsScreen}
        options={{ tabBarLabel: t.expired }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t.profile }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  const { t } = useContext(LanguageContext);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: t.login }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t.register }} />
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