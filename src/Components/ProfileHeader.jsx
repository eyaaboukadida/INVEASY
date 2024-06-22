import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserAvatar from 'react-native-user-avatar';
import ButtonOutline from './ButtonOutline';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {host} from '../Data';

const ProfileHeader = ({name}) => {
  const [currentUser, setCurrentUser] = useState({username: ''});
  const navigation = useNavigation();
  const LogoutHandle = () => {
    navigation.navigate('login');
  };
  const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const currentId = jwtDecode(token).id;

    try {
      let currentUser = await axios.get(`${host}/api/user/${currentId}`);
      setCurrentUser(currentUser.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <LinearGradient colors={['#3C2CEC', '#3C2CEC59']} style={styles.container}>
      <View style={styles.profile}>
        <UserAvatar
          textColor="#333"
          size={80}
          name={currentUser.username}
          bgColors={['#CBC8EE']}
        />
        <View style={styles.profileContainer}>
          <Text style={styles.UserName}>
            {currentUser && currentUser.firstName}{' '}
            {currentUser && currentUser.lastName}
          </Text>
          <Text style={styles.Welcome}>Welcome Admin</Text>
        </View>
      </View>
      <View style={styles.logOut}>
        <ButtonOutline
          text={'Logout'}
          action={() => LogoutHandle()}
          fontSize={22}
          flipped={true}
        />
      </View>
    </LinearGradient>
  );
};

export default ProfileHeader;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    width: Width,
    paddingHorizontal: 10,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  profileContainer: {
    width: '70%',
    alignItems: 'center',
  },
  SubTitle: {
    alignSelf: 'center',
    top: -Height * 0.1,
    color: '#242424',
    fontSize: 36,
  },
  UserName: {fontSize: 32, color: '#fff'},
  Welcome: {color: '#fff'},
  logOut: {width: Width * 0.5, alignSelf: 'flex-end', top: -Height * 0.08},
  container: {width: Width, height: Height * 0.4},
});
