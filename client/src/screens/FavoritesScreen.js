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

export default function FavoritesScreen() {
  const { token } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites();
    }, [])
  );

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

      Alert.alert(t.success, t.deleteFavorite);
      getFavorites();
    } catch (error) {
     Alert.alert(t.error, t.couldNotDeleteFavorite);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.subText }]}>
            {t.noFavorites}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {item.trip?.title}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.city}: {item.trip?.city}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.country}: {item.trip?.country}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.airline}: {item.trip?.airline}
            </Text>

            <Text style={styles.price}>
              {t.price}: ${item.trip?.price}
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFavorite(item.trip?._id)}
            >
              <Text style={styles.buttonText}>{t.deleteFavorite}</Text>
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