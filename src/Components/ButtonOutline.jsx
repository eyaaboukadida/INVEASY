import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

const ButtonOutline = ({text, action, fontSize, width, flipped}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          width: width != null ? width : '80%',
          backgroundColor: flipped ? '#fff' : '#3C2CEC',
          borderColor: !flipped ? '#fff' : '#28209C',
        },
      ]}
      onPress={action}>
      <Text
        style={[
          styles.buttonText,
          {fontSize: fontSize, color: !flipped ? '#fff' : '#28209C'},
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonOutline;

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    marginVertical: 60,
    paddingVertical: '4%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C2CEC',
    borderBottomWidth: 4,
    borderRadius: 50,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    elevation: 5,
  },
  buttonText: {color: '#fff'},
});
