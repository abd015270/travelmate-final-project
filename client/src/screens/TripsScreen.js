import { useContext, useEffect,useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as Speech from "expo-speech";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

export default function TripsScreen() {
  const { token } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrips();
    getFavorites();
  }, []);

  const getTrips = async () => {
    try {
      setLoading(true);

      const response = await API.get("/trips");
      setTrips(response.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFavorites = async () => {
    try {
      const response = await API.get("/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(response.data);
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

      Alert.alert(t.success, t.favoriteAdded);
      getFavorites();
    } catch (error) {
      Alert.alert(t.error, t.couldNotAddFavorite);
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

      Alert.alert(t.success, t.bookingCreated);
      getTrips();
    } catch (error) {
      Alert.alert(
        t.error,
        error.response?.data?.message || t.couldNotBookTrip
      );
    }
  };

  const openMap = (trip) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${trip.location.lat},${trip.location.lng}`;
    Linking.openURL(url);
  };

  const speakTrip = (trip) => {
    Speech.speak(
      `${trip.title}. ${trip.city}. ${trip.airline}. ${trip.category}. ${trip.price} dollars.`
    );
  };

  const checkPriceRange = (price) => {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;

    return true;
  };

  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const filteredTrips = trips.filter((trip) => {
    const today = new Date("2026-07-06");
     today.setHours(0, 0, 0, 0);

    const departureDate = new Date(trip.departureDate);
      departureDate.setHours(0, 0, 0, 0);

    if (departureDate < today) return false;
    if (trip.availableSeats <= 0) return false;

    const matchesSearch =
      trip.title.toLowerCase().includes(search.toLowerCase()) ||
      trip.city.toLowerCase().includes(search.toLowerCase()) ||
      trip.airline.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ? true : trip.category === categoryFilter;

    const matchesPrice = checkPriceRange(Number(trip.price));

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={t.searchPlaceholder}
        placeholderTextColor={colors.subText}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={[styles.filterTitle, { color: colors.text }]}>
        {t.categoryFilter}
      </Text>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            categoryFilter === "all" && styles.activeFilter,
          ]}
          onPress={() => setCategoryFilter("all")}
        >
          <Text style={styles.filterText}>{t.all}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            categoryFilter === "Luxury" && styles.activeFilter,
          ]}
          onPress={() => setCategoryFilter("Luxury")}
        >
          <Text style={styles.filterText}>{t.luxury}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            categoryFilter === "Adventure" && styles.activeFilter,
          ]}
          onPress={() => setCategoryFilter("Adventure")}
        >
          <Text style={styles.filterText}>{t.adventure}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            categoryFilter === "Standard" && styles.activeFilter,
          ]}
          onPress={() => setCategoryFilter("Standard")}
        >
          <Text style={styles.filterText}>{t.standard}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.filterTitle, { color: colors.text }]}>
        {t.priceFilter}
      </Text>

      <View style={styles.priceInputs}>
        <TextInput
          style={[
            styles.priceInput,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder={t.minPrice}
          placeholderTextColor={colors.subText}
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={[
            styles.priceInput,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder={t.maxPrice}
          placeholderTextColor={colors.subText}
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.clearButton} onPress={clearPriceFilter}>
          <Text style={styles.buttonText}>{t.clear}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subText }]}>
            {t.noTripsFound}
          </Text>
        }
        renderItem={({ item }) => {
          const isFavorite = favorites.some(
            (fav) => fav.trip?._id === item._id
          );

          return (
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
                {t.arrivalTime}: {item.arrivalTime}
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

              <Text
                style={[
                  styles.text,
                  {
                    color:
                      item.availableSeats <= 3 ? "#dc2626" : colors.subText,
                    fontWeight: item.availableSeats <= 3 ? "bold" : "normal",
                  },
                ]}
              >
                {t.seats}: {item.availableSeats}
              </Text>

              <Text style={styles.price}>
                {t.price}: ${item.price}
              </Text>

              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  isFavorite && styles.disabledButton,
                ]}
                onPress={() => addFavorite(item._id)}
                disabled={isFavorite}
              >
                <Text style={styles.buttonText}>
                  {isFavorite ? t.inFavorites : t.addFavorite}
                </Text>
              </TouchableOpacity>

              {item.availableSeats > 0 && (
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => bookTrip(item._id)}
                >
                  <Text style={styles.buttonText}>{t.bookTrip}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => openMap(item)}
              >
                <Text style={styles.buttonText}>{t.openMap}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.voiceButton}
                onPress={() => speakTrip(item)}
              >
                <Text style={styles.buttonText}>{t.voice}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  searchInput: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },

  filterButton: {
    backgroundColor: "#64748b",
    padding: 10,
    borderRadius: 10,
    minWidth: "23%",
  },

  activeFilter: {
    backgroundColor: "#2563eb",
  },

  filterText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  priceInputs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
  },

  priceInput: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },

  clearButton: {
    backgroundColor: "#64748b",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },

  card: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  text: {
    marginTop: 5,
  },

  price: {
    color: "#16a34a",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  favoriteButton: {
    backgroundColor: "#f97316",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: "#94a3b8",
  },

  bookButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  mapButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  voiceButton: {
    backgroundColor: "#7c3aed",
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