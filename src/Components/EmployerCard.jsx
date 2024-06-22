import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import UserAvatar from 'react-native-user-avatar';
import axios from 'axios';
import {host} from '../Data';

const EmployerCard = ({employer, onEdit}) => {
  const deleteEmployer = async id => {
    try {
      await axios.delete(`${host}/api/user/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <UserAvatar size={60} name={employer.username} bgColors={['#3c2ceca6']} />
      <View style={styles.profileContainer}>
        <Text style={styles.userName}>{employer.username}</Text>
        <Text style={styles.email}>{employer.email} </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => onEdit(employer)}
          style={styles.button}>
          <Image
            style={[styles.buttonIcon, {width: 25}]}
            source={require('../Assets/Icons/editPeople.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#FF5D1815'}]}
          onPress={() => deleteEmployer(employer._id)}>
          <Image
            style={styles.buttonIcon}
            source={require('../Assets/Icons/delete.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmployerCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
    margin: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 16,
    marginHorizontal: 15,
  },
  userName: {
    fontSize: 20,
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  email: {fontSize: 12},
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
});
