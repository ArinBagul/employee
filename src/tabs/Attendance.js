import { View, Text } from 'react-native'
import React, { useEffect, useState } from "react";
import AttendanceHistory from '../common/AttendanceHistory'
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


const Attendance = () => {
  const [userId, setUserId] = useState("");

  const db = getFirestore(app);
  useEffect(() => {

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
    };

    getSavedDate();
  }, [userId]);
console.log(userId);
  return (
      <AttendanceHistory userId={userId} />
  )
}

export default Attendance