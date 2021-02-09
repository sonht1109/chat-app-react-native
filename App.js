import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import OnBoardingPage from './src/pages/OnBoarding'
import {createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Login from './src/pages/Login/index';

export default function App() {

  const Stack = createStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="OnBoarding" component={OnBoardingPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Login" component={Login}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}