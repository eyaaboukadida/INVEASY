import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import UserAvatar from 'react-native-user-avatar';
import ButtonOutline from '../Components/ButtonOutline';
import {useNavigation} from '@react-navigation/native';
import LargeCard from '../Components/LargeCard';
import {launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {host} from '../Data';
import {jwtDecode} from 'jwt-decode';

const User = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [NewImage, setNewImage] = useState(null);
  const [currentUser, setCurrentUser] = useState({username: ''});
  const [sessions, setSessions] = useState([]);

  const navigation = useNavigation();

  const GetAllSessions = async () => {
    try {
      const response = await axios.get(`${host}/api/session`);
      setSessions(response.data.SessionList);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
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
    GetAllSessions();
  }, []);
  const LogoutHandle = () => {
    navigation.navigate('login');
  };
  const formatDateTime = dateString => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${'\n'} ${hours}:${minutes}`;
  };
  const getNewImage = async () => {
    const result = await launchCamera();
    setNewImage(result.assets[0]);
    console.log(result.assets[0]);
  };

  const SelectSession = e => {
    setModalVisible(true);
    setSelectedCard(e);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.profile}>
          <UserAvatar
            size={80}
            name={currentUser.username}
            bgColors={['#3c2ceca6']}
          />
          <View style={styles.profileContainer}>
            <Text style={styles.UserName}>
              {currentUser && currentUser.firstName}{' '}
              {currentUser && currentUser.lastName}
            </Text>
            <Text style={styles.Welcome}>Welcome to your environment </Text>
          </View>
        </View>
        <View style={styles.logOut}>
          <ButtonOutline
            text={'Logout'}
            action={() => LogoutHandle()}
            fontSize={22}
          />
        </View>
        <Text style={styles.SubTitle}> Sessions</Text>
        <View style={styles.BoxContainer}>
          {sessions
            .filter(e => e.participants.includes(currentUser.username))
            .map(e => (
              <LargeCard key={e._id} card={e} action={() => SelectSession(e)} />
            ))}
        </View>
      </ScrollView>
      <Modal
        onRequestClose={closeModal}
        animationType="fade"
        visible={isModalVisible}>
        <View style={{height: Height}}>
          <View style={styles.headerModal}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => {
                setModalVisible(false);
                setNewImage(null);
              }}>
              <Image
                style={styles.arrowIcon}
                source={require('../Assets/Icons/arrow.png')}
              />
            </TouchableOpacity>
            <Text style={[styles.SubTitle, {top: 0, color: '#fff'}]}>
              {selectedCard && selectedCard.title}
            </Text>
          </View>
          <Text
            style={[
              styles.SubTitle,
              {top: 0, marginTop: 20, marginBottom: Height * 0.05},
            ]}>
            Sessions Details
          </Text>
          <View style={styles.cardContent}>
            <View style={styles.cardInfo}>
              <Image
                source={require('../Assets/Icons/Date.png')}
                style={styles.iconInfo}
              />
              <View style={styles.DateContainer}>
                <Text style={styles.info}>
                  {selectedCard && formatDateTime(selectedCard.date)}
                </Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <Image
                source={require('../Assets/Icons/Time.png')}
                style={styles.iconInfo}
              />
              <Text style={[styles.info, {marginVertical: 10}]}>
                {selectedCard && selectedCard.duration} hours
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.status,
              {
                color:
                  selectedCard && selectedCard.status === 'Available'
                    ? '#2B9406'
                    : '#EE4E4E',
              },
            ]}>
            {selectedCard && selectedCard.status}
          </Text>
          <Image
            style={styles.uploadImage}
            source={{uri: NewImage && NewImage.uri}}
          />
          {NewImage != null ? (
            <View style={styles.validationBox}>
            <ButtonOutline
                text={'Cancel'}
                action={() => closeModal()}
                fontSize={16}
                width={'40%'}
              />
              <ButtonOutline
                text={'Send'}
                action={() =>
                  Alert.alert('Config', 'the image send successfully')
                }
                fontSize={16}
                width={'40%'}
              />
              
            </View>
          ) : (
            <View style={styles.cameraBox}>
              <TouchableOpacity
                onPress={getNewImage}
                style={styles.cameraButton}>
                <Image
                  style={styles.CameraIcon}
                  source={require('../Assets/Icons/Photo.png')}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default User;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', height: Height},
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
  UserName: {fontSize: 32, color: '#242424'},
  Welcome: {color: '#3C2CEC'},
  logOut: {width: Width * 0.5, alignSelf: 'flex-end', top: -Height * 0.08},
  BoxContainer: {paddingVertical: 50, alignItems: 'center', top: -Height * 0.1},
  headerModal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C2CEC',
    height: Height * 0.15,
  },
  closeModal: {
    width: 50,
    height: 50,
    marginRight: Width * 0.22,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff33',
    borderRadius: 50,
  },
  arrowIcon: {resizeMode: 'contain', width: '70%', tintColor: '#fff'},
  cardContent: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {color: '#242424', fontSize: 26},
  DateContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  info: {textAlign: 'center'},
  status: {
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
  },
  cardInfo: {alignItems: 'center'},
  iconInfo: {},
  cameraBox: {
    position: 'absolute',
    height: Height * 0.15,
    width: Width,
    alignItems: 'center',
    backgroundColor: '#3C2CECa6',
    justifyContent: 'center',
    bottom: Height * 0.025,
  },
  CameraIcon: {width: '100%', height: Height * 0.1},
  cameraButton: {height: '100%', width: Height * 0.1, justifyContent: 'center'},
  uploadImage: {
    width: Width * 0.55,
    height: Width * 0.55,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  validationBox: {
    flexDirection: 'row',
    width: Width,
    justifyContent: 'space-around',
  },
});
