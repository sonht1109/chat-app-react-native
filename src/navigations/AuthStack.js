import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import OnBoardingPage from '../pages/OnBoarding/index';
import Login from '../pages/Login/index';
import Signup from '../pages/Login/Signup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-community/google-signin';

const Stack = createStackNavigator()

function AuthStack() {

    const [isFirstLaunch, setIsFirstLaunch] = useState(null)

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '455241700923-sbbh5j2ugb89ejeoueih4k45g25dvuck.apps.googleusercontent.com',
          });
        
        AsyncStorage.getItem('firstLaunch')
            .then(res => {
                if (res === null || res === 'true') {
                    AsyncStorage.setItem('firstLaunch', 'true')
                    setIsFirstLaunch(true)
                }
                else {
                    setIsFirstLaunch(false)
                }
            })
            .catch(e => console.log(e))
    }, [])

    if (isFirstLaunch === null) {
        return null
    }
    else if (isFirstLaunch === true) {
        return (
            <Stack.Navigator
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name='OnBoarding' component={OnBoardingPage} />
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Signup' component={Signup} />
            </Stack.Navigator>
        )
    }
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Signup' component={Signup} />
        </Stack.Navigator>
    )
}

export default AuthStack