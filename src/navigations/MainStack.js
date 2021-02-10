import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/index';

const Stack = createStackNavigator()

export default function MainStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}