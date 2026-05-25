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

export default function FavoritesScreen() {
  const { token } = useContext(AuthContext);

  const { colors } = useContext(ThemeContext);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavorites();
  }, []);

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

  const deleteFavorite = async (tripId) => {
    try {
      await API.delete(`/favorites/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Favorite deleted");

      getFavorites();
    } catch (error) {
      Alert.alert("Error", "Could not delete favorite");
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
        data={favorites}
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
              {item.trip?.city}, {item.trip?.country}
            </Text>

            <Text style={styles.price}>${item.trip?.price}</Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFavorite(item.trip?._id)}
            >
              <Text style={styles.buttonText}>Delete Favorite</Text>
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