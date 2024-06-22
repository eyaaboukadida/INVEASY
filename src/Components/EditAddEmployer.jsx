import React, {useState} from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import ButtonOutline from './ButtonOutline';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import {host} from '../Data';

const EditAddEmployer = ({employer, onClose, onSave, isEdit, onAdd}) => {
  const [username, setUsername] = useState(isEdit ? employer.username : '');
  const [firstName, setFirstName] = useState(isEdit ? employer.firstName : '');
  const [password, setPassword] = useState('');
  const [lastName, setLastName] = useState(isEdit ? employer.lastName : '');
  const [organization, setOrganization] = useState(
    isEdit ? employer?.organization : '',
  );
  const [email, setEmail] = useState(isEdit ? employer?.email : '');
  const [phoneNumber, setPhoneNumber] = useState(
    isEdit ? employer?.phoneNumber : '',
  );
  const [authority, setAuthority] = useState('ROLE_USER');

  const CreateUser = async user => {
    try {
      let result = await (
        await axios.post(`${host}/api/user/register`, {...user, password})
      ).data;
      Alert.alert('Success', 'User created successfully');

      console.log(result);
    } catch (error) {
      Alert.alert('Error', 'bad request');
      console.log(error.data);
    }
  };

  const updateUser = async (id, user) => {
    try {
      await axios.put(`${host}/api/user/${id}`, user);
      password.length > 5 && (await updateUserPassword(id, password));
    } catch (error) {
      console.log(error);
    }
  };
  const updateUserPassword = async (id, newPass) => {
    try {
      await axios.put(`${host}/api/user/change-password/${id}`, {
        newPassword: newPass,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSave = () => {
    const updatedEmployer = {
      ...employer,
      username,
      firstName,
      lastName,
      organization,
      email,

      phoneNumber: Number(phoneNumber),
      authorities: authority,
    };
    isEdit
      ? updateUser(employer._id, updatedEmployer)
      : CreateUser(updatedEmployer);
    onClose();
  };

  const radioData = [
    {label: 'User', value: 'ROLE_USER'},
    {label: 'Admin', value: 'ROLE_ADMIN'},
  ];

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        {isEdit ? 'Edit Employer' : 'Add Employer'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={text => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder={!isEdit ? 'Password' : 'new Password'}
        value={password}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Organization"
        value={organization}
        onChangeText={text => setOrganization(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={String(phoneNumber)}
        onChangeText={text => setPhoneNumber(text)}
      />
      {/* <RadioButtonRN
        data={radioData}
        initial={authority === 'admin' ? 2 : 1}
        selectedBtn={e => setAuthority(e.value)}
        style={{width: '100%'}}
      /> */}
      <View style={styles.buttonContainer}>
        <ButtonOutline
          text="Cancel"
          fontSize={16}
          width={'40%'}
          action={() => onClose()}
        />
        <ButtonOutline
          text="Save"
          fontSize={16}
          width={'40%'}
          action={handleSave}
        />
      </View>
    </View>
  );
};

export default EditAddEmployer;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});
