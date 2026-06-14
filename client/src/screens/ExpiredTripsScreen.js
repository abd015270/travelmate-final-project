import { useContext, useEffect, useState } from "react";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import API from "../api/api";

import { AuthContext } from "../context/AuthContext";

import { ThemeContext } from "../context/ThemeContext";

export default function ExpiredTripsScreen() {
  const { token } = useContext(AuthContext);

  const { colors } = useContext(ThemeContext);

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getExpiredTrips();
  }, []);

  const getExpiredTrips = async () => {
    try {
      const response = await API.get("/trips/expired/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrips(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        Expired Trips
      </Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <Text style={[styles.title, { color: colors.text }]}>
              {item.title}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {item.city}, {item.country}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Airline: {item.airline}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Return Date: {new Date(item.returnDate).toDateString()}
            </Text>

            <Text style={styles.price}>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  text: {
    marginTop: 6,
  },

  price: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
});