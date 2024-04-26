import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const AttendanceHistory = ({ userId }) => {
  const [attendanceList, setAttendanceList] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const q = query(collection(db, "attendance"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAttendanceList(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [db, userId]);

  const renderAttendanceItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Date: {item.date}</Text>
        <Text style={styles.itemText}>Check In: {item.checkIn}</Text>
        <Text style={styles.itemText}>Check Out: {item.checkOut || "Not checked out yet"}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>
      <FlatList
        data={attendanceList}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    fontSize: 18,
    color: "#333",
  },
});

export default AttendanceHistory;
