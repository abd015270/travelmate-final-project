import { useContext, useEffect, useState } from "react";

import {
  Alert,
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
import { LanguageContext } from "../context/LanguageContext";

export default function AdminUsersScreen() {
  const { token, user: currentUser } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const { t } = useContext(LanguageContext);

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

  const changeRole = async (id, role) => {
    try {
      await API.patch(
        `/admin/users/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert(t.success, t.roleUpdated);
      getUsers();
      getUserDetails(id);
    } catch (error) {
      Alert.alert(t.error, error.response?.data?.message || t.couldNotUpdateRole);
    }
  };

  const deleteUser = async (id) => {
    if (currentUser?._id === id) {
      Alert.alert(t.error, t.cannotDeleteOwnAccount);
      return;
    }

    Alert.alert(t.deleteUser, t.areYouSure, [
      { text: t.cancel },
      {
        text: t.delete,
        onPress: async () => {
          try {
            await API.delete(`/admin/users/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            Alert.alert(t.success, t.userDeleted);
            setSelectedData(null);
            getUsers();
          } catch (error) {
            Alert.alert(t.error, error.response?.data?.message || t.couldNotDeleteUser);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        {t.usersManagement}
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.userCard, { backgroundColor: colors.card }]}
            onPress={() => getUserDetails(item._id)}
          >
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.fullName}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.email}: {item.email}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.phone}: {item.phone}
            </Text>

            <Text style={[styles.text, { color: colors.subText }]}>
              {t.role}: {item.role}
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedData && (
        <View style={[styles.detailsBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.userDetails}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            {t.fullName}: {selectedData.user.fullName}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            {t.nationalId}: {selectedData.user.nationalId}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            {t.email}: {selectedData.user.email}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            {t.phone}: {selectedData.user.phone}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            {t.birthDate}: {selectedData.user.birthDate?.slice(0, 10)}
          </Text>

          <Text style={[styles.text, { color: colors.subText }]}>
            {t.role}: {selectedData.user.role}
          </Text>

          {selectedData.user.role === "admin" ? (
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => changeRole(selectedData.user._id, "user")}
            >
              <Text style={styles.buttonText}>{t.makeUser}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.roleButton}
              onPress={() => changeRole(selectedData.user._id, "admin")}
            >
              <Text style={styles.buttonText}>{t.makeAdmin}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteUser(selectedData.user._id)}
          >
            <Text style={styles.buttonText}>{t.deleteUser}</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.bookings}
          </Text>

          {selectedData.bookings.length === 0 ? (
            <Text style={[styles.text, { color: colors.subText }]}>
              {t.noBookings}
            </Text>
          ) : (
            selectedData.bookings.map((booking) => (
              <View key={booking._id} style={styles.smallCard}>
                <Text style={[styles.text, { color: colors.subText }]}>
                  {t.trips}: {booking.trip?.title}
                </Text>

                <Text style={[styles.text, { color: colors.subText }]}>
                  {t.city}: {booking.trip?.city}
                </Text>

                <Text style={[styles.text, { color: colors.subText }]}>
                  {t.seats}: {booking.seats}
                </Text>

                <Text style={[styles.text, { color: colors.subText }]}>
                  {t.total}: ${booking.totalPrice}
                </Text>
              </View>
            ))
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t.favorites}
          </Text>

          {selectedData.favorites.length === 0 ? (
            <Text style={[styles.text, { color: colors.subText }]}>
              {t.noFavorites}
            </Text>
          ) : (
            selectedData.favorites.map((favorite) => (
              <View key={favorite._id} style={styles.smallCard}>
                <Text style={[styles.text, { color: colors.subText }]}>
                  {t.trips}: {favorite.trip?.title}
                </Text>

                <Text style={[styles.text, { color: colors.subText }]}>
                  {t.city}: {favorite.trip?.city}
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

  userCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  userName: {
    fontSize: 19,
    fontWeight: "bold",
  },

  text: {
    marginTop: 6,
  },

  detailsBox: {
    padding: 15,
    borderRadius: 12,
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

  roleButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
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