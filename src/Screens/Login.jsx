import {Alert, Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ButtonOutline from '../Components/ButtonOutline';
import InputOutLine from '../Components/InputOutLine';
import {useNavigation} from '@react-navigation/native';
import {host} from '../Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const login = async user => {
    try {
      let result = await (
        await axios.post(`${host}/api/user/login`, user)
      ).data;
      console.log(result);
      await AsyncStorage.setItem('token', result.token);
      result.user.authority == 'ROLE_ADMIN'
        ? navigation.navigate('Admin')
        : navigation.navigate('User');
    } catch (error) {
      if (error.message.includes('Network Error')) {
        Alert.alert(
          'Error',
          'Network error. Please check your internet connection.',
        );
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        Alert.alert(
          'Error',
          'Invalid credentials. Please check your username and password.',
        );
      } else if (error.request) {
        // The request was made but no response was received

        Alert.alert(
          'Error',
          'No response from the server. Please try again later.',
        );
      } else {
        // Something happened in setting up the request that triggered an Error

        Alert.alert(
          'Error',
          'An unexpected error occurred. Please try again later.',
        );
      }
    }
  };
  const LoginHandle = async () => {
    let TrimedUserName = userName.trim();
    console.log({password, username: TrimedUserName});
    await login({password, username: TrimedUserName});
    setUserName('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.logo}
        source={require('../Assets/Icons/company.png')}
      />
      <Image
        resizeMode="contain"
        style={styles.bottom}
        source={require('../Assets/UI/bottomDesign.png')}
      />
      <Text style={styles.InnerText}>Welcome to our App</Text>
      <View style={styles.inputContainer}>
        <InputOutLine
          text={'Username'}
          value={userName}
          changeValue={setUserName}
        />
        <InputOutLine
          text={'Password'}
          value={password}
          secureTextEntry={true}
          changeValue={setPassword}
        />
      </View>
      <ButtonOutline text={'LOGIN'} fontSize={28} action={LoginHandle} />
    </View>
  );
};

export default Login;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', height: Height, position: 'relative'},
  logo: {width: Width * 0.8, alignSelf: 'center'},
  inputContainer: {
    alignSelf: 'center',
    width: Width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {width: Width, position: 'absolute', top: Height * 0.45},
  InnerText: {
    bottom: Height * 0.09,
    alignSelf: 'center',
    color: '#28209C',
    fontSize: 20,
  },
});
