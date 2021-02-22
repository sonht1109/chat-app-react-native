import React from 'react'
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import Icon from 'react-native-vector-icons/Ionicons'
import ChatsStack from './ChatsStack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator()

const screensWithHiddenTabbar = [
    "AddPost", "ChatDetail", "EditProfile", "Search"
]

export default function MainStack(){

    const tabbarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route)
        if(screensWithHiddenTabbar.includes(routeName)){
            return false
        }
        return true
    }

    return(
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "#3c5898",
            }}
        >
            <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={({route}) => (
                {
                    title: "Home",
                    tabBarIcon: ({color})=><Icon name="newspaper-outline" size={20} color={color}/>,
                    tabBarVisible: tabbarVisibility(route)
                }
            )}
            />
            <Tab.Screen
            name="ChatsStack"
            component={ChatsStack}
            options={({route}) => ({
                title: "Chats",
                tabBarIcon: ({color})=><Icon name="chatbox-ellipses-outline"
                size={20} color={color} />,
                tabBarVisible: tabbarVisibility(route)
            })}
            />
            <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={({route}) => ({
                title: "Profile",
                tabBarIcon: ({color})=><Icon name="person-outline" size={20} color={color} />,
                tabBarVisible: tabbarVisibility(route)
            })}
            />
        </Tab.Navigator>
    )
}