import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/index';
import Icon from 'react-native-vector-icons/Ionicons'

const Stack = createStackNavigator()

export default function HomeStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name='Home' component={Home}
            options={({navigation}) => ({
                title: "Mowx Social",
                headerTitleStyle: {
                    fontSize: 18,
                    color: "#3c5898",
                    fontWeight: 'bold',
                },
                headerTitleAlign: "center",
                headerStyle: {
                    elevation: 0
                },
                headerRight: ()=><Icon name="add-outline" color="#3c5898" size={25} />,
                headerRightContainerStyle: {
                    marginRight: 20
                }
            })}
            />
        </Stack.Navigator>
    )
}