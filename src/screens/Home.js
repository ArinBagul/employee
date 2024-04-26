import { Platform, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "../config/firebase";
import AttendanceHistory from "../common/AttendanceHistory";

import * as Location from 'expo-location';

const Home = () => {
  const db = getFirestore(app);

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("")
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setLocation(location);
    };

    getPermission();
    // geoCode();
  }, []);
  
  useEffect(() => {
    const geoCode = async () => {
      if (location) {
        const geoCodeLoc = await Location.reverseGeocodeAsync({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        });
        setAddress(geoCodeLoc[0].formattedAddress);
      }
    };
  
    geoCode();
  }, [location]);
  

  const [currentDate, setCurrentDate] = useState("");
  const [checkInEnable, setCheckInEnable] = useState(true);
  const [checkOutEnable, setCheckOutEnable] = useState(false);
  const [attendanceDocId, setAttendanceDocId] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setCurrentDate(
      new Date().getDate() +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getFullYear()
    );

    const getSavedDate = async () => {
      const date = await AsyncStorage.getItem("DATE");
      const status = await AsyncStorage.getItem("STATUS");
      const savedUserId = await AsyncStorage.getItem("USERID");
      setUserId(savedUserId);

      if (
        date ===
          new Date().getDate() +
            "/" +
            (new Date().getMonth() + 1) +
            "/" +
            new Date().getFullYear() &&
        (status === "CIN" || status === "COUT")
      ) {
        setCheckInEnable(false);
        setCheckOutEnable(status === "CIN");
      }
      
      const eRef = doc(db, "employees", savedUserId);
      eRef.onSnapshot((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.attendance) {
            setAttendanceDocId(snapshot.id);
          }
        }
      });
    };

    getSavedDate();
  }, [userId]);

  const saveDate = async () => {
    await AsyncStorage.setItem(
      "DATE",
      new Date().getDate() +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getFullYear()
    );
  };

  const saveCheckin = async () => {
    await AsyncStorage.setItem("STATUS", "CIN");
  };

  const saveCheckout = async () => {
    await AsyncStorage.setItem("STATUS", "COUT");
  };

  const uploadCheckIn = async () => {

    let currentTime = new Date().getHours() + ":" + new Date().getMinutes();
    const geoCodeLoc = await Location.reverseGeocodeAsync({
      longitude:location.coords.longitude,
      latitude: location.coords.latitude
    })
    console.log(geoCodeLoc[0].formattedAddress)

    const attendanceData = {
      checkIn: currentTime,
      checkOut: "",
      date: currentDate,
      userId: userId,
      location: geoCodeLoc[0].formattedAddress,
    };

    try {
      const docRef = await addDoc(collection(db, "attendance"), attendanceData);
      console.log("Attendance data added with ID:", docRef.id);
      setAttendanceDocId(docRef.id);
    } catch (error) {
      console.error("Error adding attendance data:", error);
    }
  };

  const uploadCheckOut = async () => {
    if (!attendanceDocId) {
      console.error("Attendance document ID is missing.");
      return;
    }

    try {
      const attendanceRef = doc(db, "attendance", attendanceDocId);
      const attendanceDoc = await getDoc(attendanceRef);

      if (attendanceDoc.exists()) {
        const existingAttendanceData = attendanceDoc.data();
        const updatedAttendanceData = {
          ...existingAttendanceData,
          checkOut: new Date().getHours() + ":" + new Date().getMinutes(),
        };

        await setDoc(attendanceRef, updatedAttendanceData);

        console.log("Attendance data updated successfully.");
      } else {
        console.error("Attendance document does not exist.");
      }
    } catch (error) {
      console.error("Error updating attendance data:", error);
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: 60,
          elevation: 4,
          backgroundColor: "#fff",
          justifyContent: "center",
          paddingLeft: 20,
        }}
      >
        <Text style={{ color: "#000", fontWeight: "700", fontSize: 16, marginTop: 20 }}>
          EmployeePro
        </Text>
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#000",
          marginTop: 20,
          marginLeft: 20,
        }}
      >
        {"Today Date: " + currentDate}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: "#eb4034",
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        {"Current Location: " + address}
      </Text>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 60,
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          // disabled={!checkInEnable}
          style={{
            width: "40%",
            height: 50,
            backgroundColor: checkInEnable ? "green" : "gray",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 50,
            borderRadius: 10,
          }}
          onPress={() => {
            saveDate();
            saveCheckin();
            setCheckInEnable(false);
            setCheckOutEnable(true);
            uploadCheckIn();
          }}
        >
          <Text style={{ color: "#fff" }}>Check In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // disabled={!checkOutEnable}
          style={{
            width: "40%",
            height: 50,
            backgroundColor: checkOutEnable ? "green" : "gray",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 50,
            borderRadius: 10,
          }}
          onPress={() => {
            saveCheckout();
            setCheckInEnable(false);
            setCheckOutEnable(false);
            uploadCheckOut();
          }}
        >
          <Text style={{ color: "#fff" }}>Check Out</Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity onPress={()=>geoCode()}>
        <Text>Geolocate</Text>
      </TouchableOpacity> */}
      {/* <AttendanceHistory userId={userId} /> */}
    </View>
  );
};

export default Home;
