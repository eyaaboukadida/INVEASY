import {Image, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  LoginScreen,
  EmployersScreen,
  ProductScreen,
  SessionsScreen,
  UserScreen,
} from './src/Screens/index';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Admin = () => {
  return (
    <Tab.Navigator
      screenOptions={({}) => ({
        tabBarStyle: {
          position: 'absolute',
          elevation: 10,
          shadowOffset: {
            width: 0,
            height: 15,
          },
          shadowOpacity: 1,
          shadowRadius: 16.5,
          shadowColor: '#000',
          borderTopLeftRadius: 21,
          borderTopWidth: 3,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#3C2CECa6',
          borderTopRightRadius: 21,
          backgroundColor: '#fff',
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          height: 75,
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="employers"
        component={EmployersScreen}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size + 30, height: size, top: 5}}
                source={
                  focused
                    ? require('./src/Assets/Icons/employersActiv.png')
                    : require('./src/Assets/Icons/employers.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="product"
        component={ProductScreen}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./src/Assets/Icons/productActiv.png')
                    : require('./src/Assets/Icons/product.png')
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="sessions"
        component={SessionsScreen}
        options={{
          title: '',
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Image
                resizeMode="contain"
                style={{width: size, height: size, top: 5}}
                source={
                  focused
                    ? require('./src/Assets/Icons/SessionsActiv.png')
                    : require('./src/Assets/Icons/Sessions.png')
                }
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="login">
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
