import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import { app } from '../config/firebase';
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore"; 
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const checkLogin = async () => {
    setModalVisible(true);
    try {
      // Access Firestore instance
      const db = getFirestore();
  
      // Create a query to find documents where userId matches the provided email
      const q = query(collection(db, 'employees'), where('email', '==', email));
  
      // Fetch documents that match the query
      const querySnapshot = await getDocs(q);
  
      // Check if any documents were found
      if (!querySnapshot.empty) {
        // Iterate through each document
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          
          // Check if the provided password matches the stored password
          if (userData.password === password) {
            // Password matches, user authenticated
            console.log('User authenticated:', email);
            // Optionally, you can save user information in AsyncStorage
            // await AsyncStorage.setItem('USERID', email);
            // await AsyncStorage.setItem('EMAIL', email);
            // Navigate to the main screen
            navigation.navigate('Main');
          } else {
            // Password doesn't match, continue searching
            console.log('Password incorrect for user:', email);
          }
        });
      } else {
        // No documents found with the provided userId
        console.log('User not found');
        alert('User not found. Please check your credentials.');
      }
    } catch (error) {
      // Handle errors
      console.error('Login error:', error);
      alert('Login failed. Please try again later.');
    } finally {
      setModalVisible(false);
    }
  };
  
  
  const goToNextScreen = async data => {
    await AsyncStorage.setItem('EMAIL', email);
    await AsyncStorage.setItem('USERID', data.userId);
    navigation.navigate('Main');
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        placeholder="Enter Email Id"
        value={email}
        onChangeText={txt => setEmail(txt)}
        style={{
          width: '90%',
          height: 50,
          borderWidth: 1,
          borderRadius: 10,
          alignSelf: 'center',
          paddingLeft: 20,
          marginTop: 20,
        }}
      />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={txt => setPassword(txt)}
        style={{
          width: '90%',
          height: 50,
          borderWidth: 1,
          borderRadius: 10,
          alignSelf: 'center',
          paddingLeft: 20,
          marginTop: 20,
        }}
      />
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          backgroundColor: '#000',
          borderRadius: 10,
          marginTop: 50,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          if (email !== '' && password !== '') {
            checkLogin();
          } else {
            alert('Please Enter Data');
          }
        }}>
        <Text style={{color: '#fff', fontSize: 20}}>Login</Text>
      </TouchableOpacity>
      <Text
        style={{
          alignSelf: 'center',
          marginTop: 50,
          textDecorationLine: 'underline',
          fontSize: 18,
          fontWeight: '600',
        }}
        onPress={() => {
          navigation.navigate('Signup');
        }}>
        Create New Account
      </Text>
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

export default Login;
