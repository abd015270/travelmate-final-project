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
import cities from "../data/cities";
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
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [airline, setAirline] = useState("");
  const [flightHours, setFlightHours] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
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

  const formatDate = (text) => {
    const numbers = text.replace(/\D/g, "").slice(0, 8);

    if (numbers.length <= 4) {
      return numbers;
    }

    if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    }

    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6)}`;
  };

  const getTrips = async () => {
    try {
      const response = await API.get("/trips/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTrips(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCategory = () => {
    if (Number(days) >= 30) {
      return "Adventure";
    }

    if (Number(price) > 1000) {
      return "Luxury";
    }

    return "Standard";
  };

  const chooseCity = (selectedCity) => {
    const selectedData = cities.find((item) => item.city === selectedCity);

    if (!selectedData) {
      return;
    }

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
    if (!start || !end || start.length < 10 || end.length < 10) {
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

    if (parts.length !== 2) {
      return "";
    }

    let hour = Number(parts[0]);
    let minute = Number(parts[1]);

    if (isNaN(hour) || isNaN(minute)) {
      return "";
    }

    hour = (hour + hours) % 24;

    const finalHour = String(hour).padStart(2, "0");
    const finalMinute = String(minute).padStart(2, "0");

    return `${finalHour}:${finalMinute}`;
  };

  const calculateArrivalAndReturnTime = (time, hours) => {
    const calculatedTime = calculateTime(time, Number(hours));

    setArrivalTime(calculatedTime);
    setReturnTime(calculatedTime);
  };

  const handleDepartureDate = (value) => {
    const formattedDate = formatDate(value);

    setDepartureDate(formattedDate);
    calculateDays(formattedDate, returnDate);
  };

  const handleReturnDate = (value) => {
    const formattedDate = formatDate(value);

    setReturnDate(formattedDate);
    calculateDays(departureDate, formattedDate);
  };

  const handleDepartureTime = (value) => {
    setDepartureTime(value);

    if (flightHours) {
      calculateArrivalAndReturnTime(value, Number(flightHours));
    }
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
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      if (departureDate.length !== 10 || returnDate.length !== 10) {
        Alert.alert("Error", "Date must be in YYYY-MM-DD format");
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

  const deleteAllTrips = async () => {
    Alert.alert("Delete All Trips", "Are you sure?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await API.delete("/trips/admin/all", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            Alert.alert("Success", "All trips deleted");
            getTrips();
          } catch (error) {
            Alert.alert("Error", "Could not delete all trips");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>

      <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllTrips}>
        <Text style={styles.buttonText}>Delete All Trips</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { color: colors.text }]}>Choose City</Text>

      <View style={styles.cityButtons}>
        {cities.map((item) => (
          <TouchableOpacity
            key={item.city}
            style={[
              styles.cityButton,
              city === item.city && styles.selectedCityButton,
            ]}
            onPress={() => chooseCity(item.city)}
          >
            <Text style={styles.buttonText}>{item.city}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Trip Title"
        placeholderTextColor={colors.subText}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.autoText, { color: colors.subText }]}>
        City: {city || "auto"}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Country: {country || "auto"}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Airline: {airline || "auto"}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Latitude: {lat || "auto"}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Longitude: {lng || "auto"}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Image: {image ? "auto image selected" : "auto"}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Price"
        placeholderTextColor={colors.subText}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Category: {getCategory()}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Departure Date: YYYY-MM-DD"
        placeholderTextColor={colors.subText}
        value={departureDate}
        onChangeText={handleDepartureDate}
        keyboardType="number-pad"
        maxLength={10}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Return Date: YYYY-MM-DD"
        placeholderTextColor={colors.subText}
        value={returnDate}
        onChangeText={handleReturnDate}
        keyboardType="number-pad"
        maxLength={10}
      />

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Days: {days || "auto"}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Departure Time: 09:30"
        placeholderTextColor={colors.subText}
        value={departureTime}
        onChangeText={handleDepartureTime}
      />

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Arrival Time: {arrivalTime || "auto"}
      </Text>

      <Text style={[styles.autoText, { color: colors.subText }]}>
        Return Time: {returnTime || "auto"}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Available Seats"
        placeholderTextColor={colors.subText}
        value={availableSeats}
        onChangeText={setAvailableSeats}
        keyboardType="numeric"
      />

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
              Airline: {item.airline}
            </Text>

            <Text style={{ color: colors.subText }}>
              Category: {item.category}
            </Text>

            <Text style={{ color: colors.subText }}>
              Days: {item.days}
            </Text>

            <Text style={{ color: colors.subText }}>
              Departure: {item.departureDate?.slice(0, 10)} - {item.departureTime}
            </Text>

            <Text style={{ color: colors.subText }}>
              Arrival: {item.arrivalTime}
            </Text>

            <Text style={{ color: colors.subText }}>
              Return Time: {item.returnTime}
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

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  cityButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },

  cityButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 10,
  },

  selectedCityButton: {
    backgroundColor: "#16a34a",
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