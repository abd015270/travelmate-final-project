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

import API from "../api/api";

import { AuthContext } from "../context/AuthContext";

import { ThemeContext } from "../context/ThemeContext";

export default function AdminScreen() {
  const { token } = useContext(AuthContext);

  const { colors } = useContext(ThemeContext);

  const [trips, setTrips] = useState([]);

  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [airline, setAirline] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [days, setDays] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

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

  const clearForm = () => {
    setEditId(null);
    setTitle("");
    setCity("");
    setCountry("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    setAirline("");
    setDepartureDate("");
    setReturnDate("");
    setDepartureTime("");
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
    setDescription(trip.description);
    setPrice(String(trip.price));
    setImage(trip.image);
    setCategory(trip.category);
    setAirline(trip.airline);
    setDepartureDate(trip.departureDate?.slice(0, 10));
    setReturnDate(trip.returnDate?.slice(0, 10));
    setDepartureTime(trip.departureTime || "");
    setReturnTime(trip.returnTime || "");
    setDays(String(trip.days));
    setAvailableSeats(String(trip.availableSeats));
    setLat(String(trip.location?.lat));
    setLng(String(trip.location?.lng));
  };

  const saveTrip = async () => {
    try {
      if (
        !title ||
        !city ||
        !country ||
        !description ||
        !price ||
        !image ||
        !category ||
        !airline ||
        !departureDate ||
        !returnDate ||
        !departureTime ||
        !returnTime ||
        !days ||
        !availableSeats ||
        !lat ||
        !lng
      ) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      const tripData = {
        title,
        city,
        country,
        description,
        price: Number(price),
        image,
        category,
        airline,
        departureDate,
        returnDate,
        departureTime,
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Alert.alert("Success", "Trip updated");
      } else {
        await API.post("/trips", tripData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Alert.alert("Success", "Trip added");
      }

      clearForm();
      getTrips();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Could not save trip");
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
      getTrips();
    } catch (error) {
      Alert.alert("Error", "Could not delete trip");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>

      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Title" placeholderTextColor={colors.subText} value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="City" placeholderTextColor={colors.subText} value={city} onChangeText={setCity} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Country" placeholderTextColor={colors.subText} value={country} onChangeText={setCountry} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Description" placeholderTextColor={colors.subText} value={description} onChangeText={setDescription} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Price" placeholderTextColor={colors.subText} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Image URL" placeholderTextColor={colors.subText} value={image} onChangeText={setImage} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Category: Luxury / Adventure" placeholderTextColor={colors.subText} value={category} onChangeText={setCategory} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Airline" placeholderTextColor={colors.subText} value={airline} onChangeText={setAirline} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Departure Date: 2026-07-10" placeholderTextColor={colors.subText} value={departureDate} onChangeText={setDepartureDate} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Return Date: 2026-07-15" placeholderTextColor={colors.subText} value={returnDate} onChangeText={setReturnDate} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Departure Time: 09:30" placeholderTextColor={colors.subText} value={departureTime} onChangeText={setDepartureTime} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Return Time: 18:00" placeholderTextColor={colors.subText} value={returnTime} onChangeText={setReturnTime} />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Days" placeholderTextColor={colors.subText} value={days} onChangeText={setDays} keyboardType="numeric" />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Available Seats" placeholderTextColor={colors.subText} value={availableSeats} onChangeText={setAvailableSeats} keyboardType="numeric" />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Latitude" placeholderTextColor={colors.subText} value={lat} onChangeText={setLat} keyboardType="numeric" />
      <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Longitude" placeholderTextColor={colors.subText} value={lng} onChangeText={setLng} keyboardType="numeric" />

      <TouchableOpacity style={styles.saveButton} onPress={saveTrip}>
        <Text style={styles.buttonText}>{editId ? "Update Trip" : "Add Trip"}</Text>
      </TouchableOpacity>

      {editId && (
        <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
          <Text style={styles.buttonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.tripTitle, { color: colors.text }]}>{item.title}</Text>

            <Text style={{ color: colors.subText }}>
              {item.city}, {item.country}
            </Text>

            <Text style={{ color: colors.subText }}>
              {item.departureDate?.slice(0, 10)} - {item.departureTime}
            </Text>

            <Text style={styles.price}>${item.price}</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => fillForm(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTrip(item._id)}>
              <Text style={styles.buttonText}>Delete</Text>
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

  input: {
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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