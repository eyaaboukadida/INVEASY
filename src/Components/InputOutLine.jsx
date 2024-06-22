import {Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

const InputOutLine = ({text, value, changeValue}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={text}
        value={value}
        onChangeText={text => changeValue(text)}
        placeholderTextColor="#3C2CEC"
        secureTextEntry={text == 'password'}
      />
    </View>
  );
};

export default InputOutLine;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: Width * 0.8,
    height: Height * 0.09,
    borderWidth: 3,
    borderRadius: 50,
    justifyContent: 'center',
    paddingHorizontal: 50,
    marginVertical: 10,
    borderColor: '#3C2CEC',
  },
  input: {fontSize: 16},
});
