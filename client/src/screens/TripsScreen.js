import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
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
  const { token } =
    useContext(AuthContext);

  const { colors } =
    useContext(ThemeContext);

  const { t } =
    useContext(LanguageContext);

  const [trips, setTrips] = useState(
    []
  );

  const [favorites, setFavorites] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  useEffect(() => {
    getTrips();

    getFavorites();
  }, []);

  const getTrips = async () => {
    try {
      const response =
        await API.get("/trips");

      setTrips(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getFavorites = async () => {
    try {
      const response =
        await API.get(
          "/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setFavorites(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addFavorite = async (
    tripId
  ) => {
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

      Alert.alert(
        "Success",
        "Added to favorites"
      );

      getFavorites();
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not add favorite"
      );
    }
  };

  const bookTrip = async (
    tripId
  ) => {
    try {
      await API.post(
        `/bookings/${tripId}`,
        {
          seats: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert(
        "Success",
        "Trip booked"
      );

      getTrips();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message
      );
    }
  };

  const openMap = (trip) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${trip.location.lat},${trip.location.lng}`;

    Linking.openURL(url);
  };



  const filteredTrips = trips.filter(
    (trip) => {
      const matchesSearch =
        trip.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        trip.city
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "all"
          ? true
          : trip.category === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >

      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor:
              colors.card,
            color: colors.text,
          },
        ]}
        placeholder="Search..."
        placeholderTextColor={
          colors.subText
        }
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filters}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() =>
            setFilter("all")
          }
        >
          <Text
            style={
              styles.filterText
            }
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() =>
            setFilter("Luxury")
          }
        >
          <Text
            style={
              styles.filterText
            }
          >
            Luxury
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() =>
            setFilter("Adventure")
          }
        >
          <Text
            style={
              styles.filterText
            }
          >
            Adventure
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => {
          const isFavorite =
            favorites.some(
              (fav) =>
                fav.trip?._id ===
                item._id
            );

          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    colors.card,
                },
              ]}
            >
              <Image
                source={{
                  uri: item.image,
                }}
                style={
                  styles.image
                }
              />

              <Text
                style={[
                  styles.title,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  styles.text,
                  {
                    color:
                      colors.subText,
                  },
                ]}
              >
                {item.city},{" "}
                {item.country}
              </Text>

              <Text
                style={[
                  styles.text,
                  {
                    color:
                      colors.subText,
                  },
                ]}
              >
                Airline:{" "}
                {item.airline}
              </Text>

              <Text
                style={[
                  styles.text,
                  {
                    color:
                      colors.subText,
                  },
                ]}
              >
                Departure:{" "}
                {new Date(
                  item.departureDate
                ).toDateString()}
              </Text>

              <Text
                style={[
                  styles.text,
                  {
                    color:
                      colors.subText,
                  },
                ]}
              >
                Return:{" "}
                {new Date(
                  item.returnDate
                ).toDateString()}
              </Text>

              <Text
                style={[
                  styles.text,
                  {
                    color:
                      colors.subText,
                  },
                ]}
              >
                Seats:{" "}
                {
                  item.availableSeats
                }
              </Text>

              <Text
                style={
                  styles.price
                }
              >
                ${item.price}
              </Text>

              <TouchableOpacity
                style={
                  styles.favoriteButton
                }
                onPress={() =>
                  addFavorite(
                    item._id
                  )
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {isFavorite
                    ? "In Favorites"
                    : t.addFavorite}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.bookButton
                }
                onPress={() =>
                  bookTrip(
                    item._id
                  )
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {t.bookTrip}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.mapButton
                }
                onPress={() =>
                  openMap(item)
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Open Map
                </Text>
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

  aiCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  aiTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  searchInput: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  filters: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 15,
  },

  filterButton: {
    backgroundColor:
      "#2563eb",
    padding: 10,
    borderRadius: 10,
    width: "30%",
  },

  filterText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
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
    backgroundColor:
      "#f97316",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  bookButton: {
    backgroundColor:
      "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  mapButton: {
    backgroundColor:
      "#16a34a",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  voiceButton: {
    backgroundColor:
      "#7c3aed",
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