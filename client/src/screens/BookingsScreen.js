import {
  useContext,
  useEffect,
  useState,
} from "react";

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

import { ThemeContext } from "../context/ThemeContext";

import { LanguageContext } from "../context/LanguageContext";

export default function BookingsScreen() {
  const { token } = useContext(AuthContext);

  const { colors } = useContext(ThemeContext);

  const { t } = useContext(LanguageContext);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const response = await API.get("/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await API.delete(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Booking deleted");

      getBookings();
    } catch (error) {
      Alert.alert("Error", "Could not delete booking");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              {item.trip?.title}
            </Text>

            <Text
              style={[
                styles.text,
                {
                  color: colors.subText,
                },
              ]}
            >
              {item.trip?.airline}
            </Text>

            <Text
              style={[
                styles.text,
                {
                  color: colors.subText,
                },
              ]}
            >
              {t.seats}: {item.seats}
            </Text>

            <Text
              style={[
                styles.text,
                {
                  color: colors.subText,
                },
              ]}
            >
              {t.status}: {item.status}
            </Text>

            <Text style={styles.price}>
              {t.total}: ${item.totalPrice}
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteBooking(item._id)}
            >
              <Text style={styles.buttonText}>Delete Booking</Text>
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

  card: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  text: {
    marginTop: 8,
  },

  price: {
    marginTop: 8,
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: 18,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});