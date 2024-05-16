import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { app } from "../config/firebase";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const Leaves = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const db = getFirestore(app);

  const leaveDataOnFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "LeaveRequestEmployees"), {
        startDate: startDate,
        endDate: endDate,
        reason: reason,
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", "Leave request submitted successfully");
      setStartDate(new Date());
      setEndDate(new Date());
      setReason("");
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Failed to submit leave request");
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !reason) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    leaveDataOnFirestore();
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Date</Text>
      <Text style={styles.selectedDate}>{startDate.toDateString()}</Text>
      <Button onPress={() => setShowStartDatePicker(true)} title="Select start date" />
      {showStartDatePicker && (
        <RNDateTimePicker
          value={startDate}
          mode="date"
          onChange={onChangeStartDate}
        />
      )}
      

      <Text style={styles.label}>End Date</Text>
      <Text style={styles.selectedDate}>{endDate.toDateString()}</Text>
      <Button onPress={() => setShowEndDatePicker(true)} title="Select end date" />
      {showEndDatePicker && (
        <RNDateTimePicker
          value={endDate}
          mode="date"
          onChange={onChangeEndDate}
        />
      )}
      
      <Text style={styles.label}>Reason</Text>
      <TextInput
        style={[styles.input, styles.reasonInput]}
        value={reason}
        onChangeText={text => setReason(text)}
        placeholder="Reason"
        multiline
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  selectedDate: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },
  reasonInput: {
    height: 100,
  },
});

export default Leaves;
