import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import Icon from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

export default function MainStack(){
    return(
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "#2a5898"
            }}
        >
            <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
                title: "Home",
                tabBarIcon: ({size, color})=><Icon name="newspaper-outline" size={size} color={color}/>
            }}
            />
            <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
                title: "Profile",
                tabBarIcon: ({size, color})=><Icon name="person-outline" size={size} color={color} />
            }}
            />
        </Tab.Navigator>
    )
}