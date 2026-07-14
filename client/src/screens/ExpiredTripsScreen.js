import { useContext, useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (dateString) => {
  if (!dateString) {
    return new Date();
  }

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

const calculateDaysBetweenDates = (start, end) => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const difference = endDate.getTime() - startDate.getTime();

  if (difference < 0) {
    return null;
  }

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

export default function ExpiredTripsScreen() {
  const { token } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [newDepartureDate, setNewDepartureDate] = useState("");
  const [newReturnDate, setNewReturnDate] = useState("");

  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

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
    Alert.alert(t.deletePermanently, t.areYouSure, [
      {
        text: t.cancel,
      },
      {
        text: t.delete,
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/trips/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            Alert.alert(t.success, t.tripDeleted);
            getExpiredTrips();
          } catch (error) {
            Alert.alert(t.error, t.couldNotDeleteTrip);
          }
        },
      },
    ]);
  };

  const startRestore = (trip) => {
    setSelectedTrip(trip);
    setNewDepartureDate("");
    setNewReturnDate("");
  };

  const restoreTrip = async () => {
    try {
      if (!newDepartureDate || !newReturnDate) {
        Alert.alert(t.error, t.fillAllFields);
        return;
      }

      const days = calculateDaysBetweenDates(
        newDepartureDate,
        newReturnDate
      );

      if (days === null || days <= 0) {
        Alert.alert(t.error, t.invalidTripDates);
        return;
      }

      await API.patch(
        `/trips/${selectedTrip._id}`,
        {
          departureDate: newDepartureDate,
          returnDate: newReturnDate,
          days,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert(t.success, t.tripRestored);

      setSelectedTrip(null);
      setNewDepartureDate("");
      setNewReturnDate("");
      setShowDeparturePicker(false);
      setShowReturnPicker(false);

      getExpiredTrips();
    } catch (error) {
      Alert.alert(
        t.error,
        error.response?.data?.message || t.couldNotRestoreTrip
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        {t.expiredTrips}
      </Text>

      {selectedTrip && (
        <View style={[styles.restoreBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t.restoreTrip}: {selectedTrip.title}
          </Text>

          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowDeparturePicker(true)}
          >
            <Text
              style={{
                color: newDepartureDate ? colors.text : colors.subText,
              }}
            >
              {newDepartureDate || t.newDepartureDate}
            </Text>
          </TouchableOpacity>

          {showDeparturePicker && (
            <DateTimePicker
              value={parseDate(newDepartureDate)}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDeparturePicker(false);

                if (event.type === "dismissed" || !selectedDate) {
                  return;
                }

                setNewDepartureDate(formatLocalDate(selectedDate));
              }}
            />
          )}

          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowReturnPicker(true)}
          >
            <Text
              style={{
                color: newReturnDate ? colors.text : colors.subText,
              }}
            >
              {newReturnDate || t.newReturnDate}
            </Text>
          </TouchableOpacity>

          {showReturnPicker && (
            <DateTimePicker
              value={parseDate(newReturnDate)}
              mode="date"
              display="default"
              minimumDate={
                newDepartureDate
                  ? parseDate(newDepartureDate)
                  : new Date()
              }
              onChange={(event, selectedDate) => {
                setShowReturnPicker(false);

                if (event.type === "dismissed" || !selectedDate) {
                  return;
                }

                setNewReturnDate(formatLocalDate(selectedDate));
              }}
            />
          )}

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={restoreTrip}
          >
            <Text style={styles.buttonText}>{t.restoreTrip}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setSelectedTrip(null);
              setNewDepartureDate("");
              setNewReturnDate("");
            }}
          >
            <Text style={styles.buttonText}>{t.cancel}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subText }]}>
            {t.noExpiredTrips}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <Text style={[styles.title, { color: colors.text }]}>
              {item.title}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.city}: {item.city}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.country}: {item.country}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.airline}: {item.airline}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.category}: {item.category}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.departureDate}:{" "}
              {new Date(item.departureDate).toLocaleDateString()}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.departureTime}: {item.departureTime}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.returnDate}:{" "}
              {new Date(item.returnDate).toLocaleDateString()}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.returnTime}: {item.returnTime}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.days}: {item.days}
            </Text>

            <Text style={styles.price}>
              {t.price}: ${item.price}
            </Text>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={() => startRestore(item)}
            >
              <Text style={styles.buttonText}>{t.restoreEditDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTrip(item._id)}
            >
              <Text style={styles.buttonText}>{t.deletePermanently}</Text>
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
    minHeight: 50,
    justifyContent: "center",
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

  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
  },
});