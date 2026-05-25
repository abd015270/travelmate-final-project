import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function TripsScreen() {
  const { token } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getTrips();
  }, []);

  const getTrips = async () => {
    try {
      const response = await API.get("/trips");
      setTrips(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addFavorite = async (tripId) => {
    try {
      await API.post(
        `/favorites/${tripId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Added to favorites");
    } catch (error) {
      Alert.alert("Error", "Could not add favorite");
    }
  };

  const bookTrip = async (tripId) => {
    try {
      await API.post(
        `/bookings/${tripId}`,
        { seats: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Trip booked");
      getTrips();
    } catch (error) {
      Alert.alert("Error", "Could not book trip");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.text}>
              {item.city}, {item.country}
            </Text>

            <Text style={styles.text}>{item.description}</Text>

            <Text style={styles.price}>${item.price}</Text>

            <Text style={styles.text}>Seats: {item.availableSeats}</Text>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => addFavorite(item._id)}
            >
              <Text style={styles.buttonText}>Add Favorite</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => bookTrip(item._id)}
            >
              <Text style={styles.buttonText}>Book Trip</Text>
            </TouchableOpacity>
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
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: "#444",
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: "#16a34a",
    fontWeight: "bold",
    marginVertical: 6,
  },
  favoriteButton: {
    backgroundColor: "#f97316",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  bookButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});