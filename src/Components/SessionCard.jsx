import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserAvatar from 'react-native-user-avatar';
import {host} from '../Data';
import axios from 'axios';

const SessionCard = ({session, onEdit}) => {
  const formatDateTime = dateString => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} - ${hours}:${minutes}`;
  };
  useEffect(() => {}, []);
  const deleteSession = async id => {
    try {
      await axios.delete(`${host}/api/session/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>{session.title}</Text>
        <View style={styles.dateContainer}>
          <Image
            source={require('../Assets/Icons/Date.png')}
            style={styles.iconInfo}
          />
          <Text style={styles.date}>
            {session && formatDateTime(session.date)}
            {'\n'}
            {session && session.duration} hours
          </Text>
        </View>
        <Text
          style={[
            styles.status,
            {color: session.status === 'Available' ? '#2B9406' : '#EE4E4E'},
          ]}>
          {session && session.status}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => onEdit(session)} style={styles.button}>
          <Image
            style={[styles.buttonIcon, {width: 25}]}
            source={require('../Assets/Icons/edit.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteSession(session._id)}
          style={[styles.button, {backgroundColor: '#FF5D1815'}]}>
          <Image
            style={styles.buttonIcon}
            source={require('../Assets/Icons/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SessionCard;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Height * 0.2,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#3c2ceca6',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
    margin: 16,
    borderTopWidth: 1,
    borderLeftWidth: 5,
    borderRightWidth: 1,
    borderBottomWidth: 5,
    borderColor: '#3c2ceca6',
  },
  profileContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    height: '80%',
  },
  title: {
    fontSize: 20,
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    right: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
  iconInfo: {
    height: Height * 0.05,
    resizeMode: 'contain',
    tintColor: '#28209C6a',
  },
  dateContainer: {flexDirection: 'row', alignItems: 'center'},
  date: {},
});
