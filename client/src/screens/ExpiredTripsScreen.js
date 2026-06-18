import { useContext, useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import API from "../api/api";

import { AuthContext } from "../context/AuthContext";

import { ThemeContext } from "../context/ThemeContext";

export default function ExpiredTripsScreen() {
  const { token } = useContext(AuthContext);

  const { colors } = useContext(ThemeContext);

  const [trips, setTrips] = useState([]);

  const [selectedTrip, setSelectedTrip] = useState(null);

  const [newDepartureDate, setNewDepartureDate] = useState("");

  const [newReturnDate, setNewReturnDate] = useState("");

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

  const deleteTrip = async (id) => {
    try {
      await API.delete(`/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Trip deleted");

      getExpiredTrips();
    } catch (error) {
      Alert.alert("Error", "Could not delete trip");
    }
  };

  const startRestore = (trip) => {
    setSelectedTrip(trip);

    setNewDepartureDate("");

    setNewReturnDate("");
  };

  const restoreTrip = async () => {
    try {
      if (!newDepartureDate || !newReturnDate) {
        Alert.alert("Error", "Please enter new dates");
        return;
      }

      await API.patch(
        `/trips/${selectedTrip._id}`,
        {
          departureDate: newDepartureDate,
          returnDate: newReturnDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Trip restored");

      setSelectedTrip(null);

      setNewDepartureDate("");

      setNewReturnDate("");

      getExpiredTrips();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Could not restore trip");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        Expired Trips
      </Text>

      {selectedTrip && (
        <View style={[styles.restoreBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Restore: {selectedTrip.title}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="New Departure Date: 2026-07-10"
            placeholderTextColor={colors.subText}
            value={newDepartureDate}
            onChangeText={setNewDepartureDate}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="New Return Date: 2026-07-20"
            placeholderTextColor={colors.subText}
            value={newReturnDate}
            onChangeText={setNewReturnDate}
          />

          <TouchableOpacity style={styles.restoreButton} onPress={restoreTrip}>
            <Text style={styles.buttonText}>Restore Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setSelectedTrip(null)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

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
              Category: {item.category}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Departure: {new Date(item.departureDate).toDateString()} -{" "}
              {item.departureTime}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Return: {new Date(item.returnDate).toDateString()} -{" "}
              {item.returnTime}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Days: {item.days}
            </Text>

            <Text style={styles.price}>${item.price}</Text>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={() => startRestore(item)}
            >
              <Text style={styles.buttonText}>Restore / Edit Date</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTrip(item._id)}
            >
              <Text style={styles.buttonText}>Delete Permanently</Text>
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
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },

  restoreBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
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

  restoreButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  cancelButton: {
    backgroundColor: "#64748b",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});  