import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import ButtonOutline from './ButtonOutline';
import DatePicker from 'react-native-date-picker';
import RadioButtonRN from 'radio-buttons-react-native';
import CheckBox from 'react-native-check-box';
import axios from 'axios';
import {host} from '../Data';

const DatePickerCustom = ({time, setTime}) => {
  useEffect(() => {
    console.log('DatePickerCustom time:', time);
  }, [time]);

  const handleDateChange = newDate => {
    try {
      console.log('New date selected:', newDate);
      setTime(newDate);
    } catch (error) {
      console.error('Error changing date:', error);
    }
  };
  return (
    <DatePicker
      textColor="#000"
      mode="datetime"
      date={time}
      onDateChange={handleDateChange}
      style={{backgroundColor: '#fff', borderRadius: 10, padding: 10}}
    />
  );
};

const data = [{label: 'Available'}, {label: 'Disable'}];

const EditAddSession = ({session, onClose, onSave, isEdit, onAdd}) => {
  const [title, setTitle] = useState(isEdit ? session?.title : '');
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(isEdit ? session?.duration : '');
  const [status, setStatus] = useState(isEdit ? session?.status : '');
  const [selectedUsers, setSelectedUsers] = useState(
    isEdit ? session?.participants : [],
  );
  const [userList, setUserList] = useState([]);
  const GetAllUsers = async () => {
    try {
      const response = await axios.get(`${host}/api/user`);
      setUserList(response.data.userList);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };
  const createSession = async newSess => {
    try {
      await axios.post(`${host}/api/session/`, newSess);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };
  const updatedSession = async newSess => {
    try {
      await axios.put(`${host}/api/session/${session._id}`, newSess);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
    }
  };
  useEffect(() => {
    if (session?.date) {
      const parsedDate = new Date(session.date);
      if (!isNaN(parsedDate)) {
        setDate(parsedDate);
      } else {
        console.error('Invalid date:', session.date);
      }
    }
  }, [session?.date]);
  useEffect(() => {
    GetAllUsers();
  }, []);

  const handleSave = () => {
    console.log('Title:', title);
    console.log('Date:', date);
    console.log('Duration:', duration);
    console.log('Status:', status);
    console.log('Selected Users:', selectedUsers);

    const newSession = {
      title,
      date,
      duration,
      status,
      participants: selectedUsers,
    };

    if (isEdit) {
      updatedSession(newSession);
    } else {
      createSession(newSession);
    }

    onClose();
  };

  const toggleUserSelection = username => {
    setSelectedUsers(prevSelectedUsers =>
      prevSelectedUsers.includes(username)
        ? prevSelectedUsers.filter(user => user !== username)
        : [...prevSelectedUsers, username],
    );
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        {isEdit ? 'Edit Session' : 'Add Session'}
      </Text>
      <TextInput
        placeholderTextColor="#28209C"
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <DatePickerCustom time={date} setTime={setDate} />
      <TextInput
        placeholderTextColor="#28209C"
        style={styles.input}
        placeholder="Duration"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric" // Ensure numeric input for duration
      />
      <RadioButtonRN
        style={{width: '100%'}}
        data={data}
        selectedBtn={e => setStatus(e.label)}
        initial={status === 'Available' ? 1 : status === 'Disable' ? 2 : 0}
      />
      <ScrollView style={styles.scrollView}>
        {userList.map(user => (
          <CheckBox
            key={user.username}
            style={styles.checkbox}
            onClick={() => toggleUserSelection(user.username)}
            isChecked={selectedUsers.includes(user.username)}
            leftText={user.username}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ButtonOutline
          text="Cancel"
          fontSize={16}
          width="40%"
          action={onClose}
        />
        <ButtonOutline
          text="Save"
          fontSize={16}
          width="40%"
          action={handleSave}
        />
      </View>
    </View>
  );
};

export default EditAddSession;

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
    borderColor: '#28209C',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  scrollView: {
    width: '100%',
    maxHeight: 150,
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});
