import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../pages/Profile/index';

const Stack = createStackNavigator()

export default function ProfileStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name='Profile'
            component={Profile}
            options={{
                headerShown: false
            }}
            />
            <Stack.Screen
                name="UserProfile"
                component={Profile}
                options={{
                    title: '',
                    headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0
                    }
                }}
            />
        </Stack.Navigator>
    )
}