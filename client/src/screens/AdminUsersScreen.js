import { useContext, useEffect, useState } from "react";

import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function AdminUsersScreen() {
  const { token } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [users, setUsers] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await API.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserDetails = async (id) => {
    try {
      const response = await API.get(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        Users Management
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => getUserDetails(item._id)}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {item.fullName}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Email: {item.email}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Phone: {item.phone}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              Role: {item.role}
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedData && (
        <View style={[styles.detailsBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            User Details
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            Name: {selectedData.user.fullName}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            National ID: {selectedData.user.nationalId}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            Email: {selectedData.user.email}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            Phone: {selectedData.user.phone}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Bookings
          </Text>

          {selectedData.bookings.length === 0 ? (
            <Text style={[styles.text, { color: colors.subText }]}>
              No bookings
            </Text>
          ) : (
            selectedData.bookings.map((booking) => (
              <View key={booking._id} style={styles.smallCard}>
                <Text style={[styles.text, { color: colors.subText }]}>
                  Trip: {booking.trip?.title}
                </Text>

                <Text style={[styles.text, { color: colors.subText }]}>
                  Seats: {booking.seats}
                </Text>

                <Text style={[styles.text, { color: colors.subText }]}>
                  Total: ${booking.totalPrice}
                </Text>
              </View>
            ))
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Favorites
          </Text>

          {selectedData.favorites.length === 0 ? (
            <Text style={[styles.text, { color: colors.subText }]}>
              No favorites
            </Text>
          ) : (
            selectedData.favorites.map((favorite) => (
              <View key={favorite._id} style={styles.smallCard}>
                <Text style={[styles.text, { color: colors.subText }]}>
                  Trip: {favorite.trip?.title}
                </Text>

                <Text style={[styles.text, { color: colors.subText }]}>
                  City: {favorite.trip?.city}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
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

  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  text: {
    marginTop: 6,
  },

  detailsBox: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },

  smallCard: {
    borderWidth: 1,
    borderColor: "#64748b",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
});