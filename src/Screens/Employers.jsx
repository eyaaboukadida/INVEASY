import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProfileHeader from '../Components/ProfileHeader';
import EmployerCard from '../Components/EmployerCard';
import EditAddEmployer from '../Components/EditAddEmployer';
import axios from 'axios';
import {host} from '../Data';

const Employers = () => {
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEdit, setisEdit] = useState(false);

  const [employers, setEmployers] = useState([]);

  const GetAllUsers = async () => {
    try {
      const response = await axios.get(`${host}/api/user`);
      setEmployers(response.data.userList);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    GetAllUsers();
  }, [employers]);
  const handleEdit = employer => {
    setSelectedEmployer(employer);
    setisEdit(true);
    setModalVisible(true);
  };
  const handleAdd = (name, email) => {
    setEmployers([...employers, {name, email, id: employers.length + 1}]);
  };
  const handleSave = updatedEmployer => {
    const updatedEmployers = employers.map(employer =>
      employer.id === updatedEmployer.id ? updatedEmployer : employer,
    );
    setEmployers(updatedEmployers);
    setSelectedEmployer({email: '', name: ''});
  };

  return (
    <View style={styles.container}>
      <ProfileHeader name={'Eya BouKadida'} />
      <View style={styles.CardsBox}>
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setisEdit(false);
            }}
            style={styles.addButton}>
            <Image
              style={styles.addIcon}
              resizeMode="contain"
              source={require('../Assets/Icons/addUser.png')}
            />
          </TouchableOpacity>
          <Text style={styles.Header}>List Of Employees</Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {employers.map((e, i) => (
            <EmployerCard employer={e} onEdit={handleEdit} key={i} />
          ))}
        </ScrollView>
      </View>
      <Modal
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        visible={isModalVisible}>
        <EditAddEmployer
          employer={selectedEmployer}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          isEdit={isEdit}
          onAdd={handleAdd}
        />
      </Modal>
    </View>
  );
};

export default Employers;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff'},
  CardsBox: {
    width: Width,
    paddingTop: Height * 0.02,
    backgroundColor: '#fff',
    height: Height * 0.6,
    borderRadius: 50,
    top: -Height * 0.12,
  },
  scrollContainer: {},
  addButton: {
    width: Width * 0.17,
    height: Width * 0.17,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,

    marginRight: 20,

    // paddingHorizontal: Width * 0.05,
    backgroundColor: '#28209C',
  },
  addIcon: {width: '50%'},
  Header: {
    position: 'absolute',
    zIndex: 100,
    left: 50,
    top: Height * 0.04,
    fontSize: 22,
  },
});
