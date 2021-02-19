import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../pages/Profile/index';
import EditProfile from '../pages/Profile/EditProfile';
import CustomBackArrow from '../components/CustomBackArrow';

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
            component={EditProfile}
            name="EditProfile"
            options={({navigation}) => ({
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0
                },
                title: '',
                headerLeft: ()=> <CustomBackArrow navigation={navigation} />
            })}
            />
        </Stack.Navigator>
    )
}