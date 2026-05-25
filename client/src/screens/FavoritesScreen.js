import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function FavoritesScreen() {
  const { token } = useContext(AuthContext);

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

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.trip?.title}</Text>
            <Text style={styles.text}>{item.trip?.city}</Text>
            <Text style={styles.price}>${item.trip?.price}</Text>
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
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "white",
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
    color: "#444",
  },
  price: {
    marginTop: 8,
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: 18,
  },
});