import { useCallback, useContext, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

export default function BookingsScreen() {
  const { token } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const [bookings, setBookings] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getBookings();
    }, [])
  );

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

      Alert.alert(t.success, t.deleteBooking);
      getBookings();
    } catch (error) {
      Alert.alert(t.error, "Could not delete booking");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subText }]}>
            {t.noBookings}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {item.trip?.title}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {item.trip?.city}, {item.trip?.country}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.airline}: {item.trip?.airline}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.seats}: {item.seats}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.status}: {item.status}
            </Text>

            <Text style={styles.price}>
              {t.total}: ${item.totalPrice}
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteBooking(item._id)}
            >
              <Text style={styles.buttonText}>{t.deleteBooking}</Text>
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

  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
  },
});