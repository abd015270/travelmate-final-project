import { useContext, useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

import API from "../api/api";
import cities from "../data/cities";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

export default function AdminScreen() {
  const { token } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const [trips, setTrips] = useState([]);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [airline, setAirline] = useState("");
  const [flightHours, setFlightHours] = useState("");

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [days, setDays] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    getTrips();
  }, []);

  const formatPickedDate = (date) => date.toISOString().split("T")[0];

  const getTrips = async () => {
    try {
      const response = await API.get("/trips/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrips(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCategory = () => {
    if (Number(days) >= 30) return "Adventure";
    if (Number(price) > 1000) return "Luxury";
    return "Standard";
  };

  const chooseCity = (selectedCity) => {
    const selectedData = cities.find((item) => item.city === selectedCity);
    if (!selectedData) return;

    setCity(selectedData.city);
    setCountry(selectedData.country);
    setAirline(selectedData.airline);
    setFlightHours(String(selectedData.flightHours));
    setLat(String(selectedData.lat));
    setLng(String(selectedData.lng));
    setImage(selectedData.image);

    if (departureTime) {
      calculateArrivalAndReturnTime(departureTime, selectedData.flightHours);
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) {
      setDays("");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setDays("");
      return;
    }

    if (endDate < startDate) {
      setDays("");
      return;
    }

    const diff = endDate - startDate;
    const result = Math.ceil(diff / (1000 * 60 * 60 * 24));

    setDays(String(result));
  };

  const calculateTime = (time, hours) => {
    const parts = time.split(":");
    if (parts.length !== 2) return "";

    let hour = Number(parts[0]);
    let minute = Number(parts[1]);

    if (isNaN(hour) || isNaN(minute)) return "";

    hour = (hour + Number(hours)) % 24;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

  const calculateArrivalAndReturnTime = (time, hours) => {
    const calculatedTime = calculateTime(time, hours);

    setArrivalTime(calculatedTime);
    setReturnTime(calculatedTime);
  };

  const handleDepartureTime = (value) => {
    setDepartureTime(value);

    if (flightHours) {
      calculateArrivalAndReturnTime(value, flightHours);
    }
  };

  const handleDepartureDatePick = (selectedDate) => {
    const date = formatPickedDate(selectedDate);

    setDepartureDate(date);
    calculateDays(date, returnDate);
  };

  const handleReturnDatePick = (selectedDate) => {
    const date = formatPickedDate(selectedDate);

    setReturnDate(date);
    calculateDays(departureDate, date);
  };

  const clearForm = () => {
    setEditId(null);
    setTitle("");
    setCity("");
    setCountry("");
    setPrice("");
    setImage("");
    setAirline("");
    setFlightHours("");
    setDepartureDate("");
    setReturnDate("");
    setDepartureTime("");
    setArrivalTime("");
    setReturnTime("");
    setDays("");
    setAvailableSeats("");
    setLat("");
    setLng("");
  };

  const fillForm = (trip) => {
    setEditId(trip._id);
    setTitle(trip.title);
    setCity(trip.city);
    setCountry(trip.country);
    setPrice(String(trip.price));
    setImage(trip.image);
    setAirline(trip.airline);
    setDepartureDate(trip.departureDate?.slice(0, 10));
    setReturnDate(trip.returnDate?.slice(0, 10));
    setDepartureTime(trip.departureTime || "");
    setArrivalTime(trip.arrivalTime || "");
    setReturnTime(trip.returnTime || "");
    setDays(String(trip.days));
    setAvailableSeats(String(trip.availableSeats));
    setLat(String(trip.location?.lat));
    setLng(String(trip.location?.lng));

    const selectedData = cities.find((item) => item.city === trip.city);

    if (selectedData) {
      setFlightHours(String(selectedData.flightHours));
    }
  };

  const saveTrip = async () => {
    try {
      if (
        !title ||
        !city ||
        !country ||
        !price ||
        !image ||
        !airline ||
        !departureDate ||
        !returnDate ||
        !departureTime ||
        !arrivalTime ||
        !returnTime ||
        !days ||
        !availableSeats ||
        !lat ||
        !lng
      ) {
        Alert.alert(t.error, t.fillAllFields);
        return;
      }

      const tripData = {
        title,
        city,
        country,
        price: Number(price),
        image,
        airline,
        departureDate,
        returnDate,
        departureTime,
        arrivalTime,
        returnTime,
        days: Number(days),
        availableSeats: Number(availableSeats),
        location: {
          lat: Number(lat),
          lng: Number(lng),
        },
      };

      if (editId) {
        await API.patch(`/trips/${editId}`, tripData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Alert.alert(t.success, t.tripUpdated);
      } else {
        await API.post("/trips", tripData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Alert.alert(t.success, t.tripAdded);
      }

      clearForm();
      getTrips();
    } catch (error) {
      Alert.alert(t.error, error.response?.data?.message || t.couldNotSaveTrip);
    }
  };

  const deleteTrip = async (id) => {
    try {
      await API.delete(`/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert(t.success, t.tripDeleted);
      getTrips();
    } catch (error) {
      Alert.alert(t.error, t.couldNotDeleteTrip);
    }
  };

  const deleteAllTrips = async () => {
    Alert.alert(t.deleteAllTrips, t.areYouSure, [
      { text: t.cancel },
      {
        text: t.delete,
        onPress: async () => {
          try {
            await API.delete("/trips/admin/all", {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert(t.success, t.allTripsDeleted);
            getTrips();
          } catch (error) {
            Alert.alert(t.error, t.couldNotDeleteAllTrips);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {t.adminDashboard}
      </Text>

      <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllTrips}>
        <Text style={styles.buttonText}>{t.deleteAllTrips}</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: colors.text }]}>{t.chooseCity}</Text>

      <View
        style={[
          styles.pickerBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Picker
          selectedValue={city}
          onValueChange={(value) => {
            if (value) chooseCity(value);
          }}
          style={{ color: colors.text }}
        >
          <Picker.Item label={t.selectCity} value="" />

          {cities.map((item) => (
            <Picker.Item key={item.city} label={item.city} value={item.city} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholder={t.tripTitle}
        placeholderTextColor={colors.subText}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.city}: {city || t.auto}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.country}: {country || t.auto}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.airline}: {airline || t.auto}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.latitude}: {lat || t.auto}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.longitude}: {lng || t.auto}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {image ? t.autoImageSelected : t.auto}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholder={t.price}
        placeholderTextColor={colors.subText}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.category}: {getCategory()}
      </Text>

      <TouchableOpacity
        style={[styles.input, { backgroundColor: colors.card }]}
        onPress={() => setShowDeparturePicker(true)}
      >
        <Text style={{ color: departureDate ? colors.text : colors.subText }}>
          {departureDate || t.departureDate}
        </Text>
      </TouchableOpacity>

      {showDeparturePicker && (
        <DateTimePicker
          value={departureDate ? new Date(departureDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDeparturePicker(false);
            if (selectedDate) handleDepartureDatePick(selectedDate);
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.input, { backgroundColor: colors.card }]}
        onPress={() => setShowReturnPicker(true)}
      >
        <Text style={{ color: returnDate ? colors.text : colors.subText }}>
          {returnDate || t.returnDate}
        </Text>
      </TouchableOpacity>

      {showReturnPicker && (
        <DateTimePicker
          value={returnDate ? new Date(returnDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowReturnPicker(false);
            if (selectedDate) handleReturnDatePick(selectedDate);
          }}
        />
      )}

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.days}: {days || t.auto}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholder={`${t.departureTime}: 09:30`}
        placeholderTextColor={colors.subText}
        value={departureTime}
        onChangeText={handleDepartureTime}
      />

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.arrivalTime}: {arrivalTime || t.auto}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        {t.returnTime}: {returnTime || t.auto}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholder={t.availableSeats}
        placeholderTextColor={colors.subText}
        value={availableSeats}
        onChangeText={setAvailableSeats}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveTrip}>
        <Text style={styles.buttonText}>
          {editId ? t.updateTrip : t.addTrip}
        </Text>
      </TouchableOpacity>

      {editId && (
        <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
          <Text style={styles.buttonText}>{t.cancelEdit}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.tripTitle, { color: colors.text }]}>
              {item.title}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.city}: {item.city}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.country}: {item.country}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.airline}: {item.airline}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.category}: {item.category}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.days}: {item.days}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.departureDate}: {item.departureDate?.slice(0, 10)} -{" "}
              {item.departureTime}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.arrivalTime}: {item.arrivalTime}
            </Text>

            <Text style={{ color: colors.subText }}>
              {t.returnTime}: {item.returnTime}
            </Text>

            <Text style={styles.price}>
              {t.price}: ${item.price}
            </Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => fillForm(item)}
            >
              <Text style={styles.buttonText}>{t.edit}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTrip(item._id)}
            >
              <Text style={styles.buttonText}>{t.delete}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  pickerBox: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },

  input: {
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  autoText: {
    fontSize: 15,
    marginBottom: 12,
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  cancelButton: {
    backgroundColor: "#64748b",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },

  deleteAllButton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  price: {
    color: "#16a34a",
    fontWeight: "bold",
    marginTop: 6,
  },

  editButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});