import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import Icon from 'react-native-vector-icons/Ionicons'
import ChatsStack from './ChatsStack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator()

const screensWithHiddenTabbar = [
    "AddPost", "ChatDetail", "EditProfile"
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
                activeTintColor: "#2a5898"
            }}
        >
            <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={({route}) => (
                {
                    title: "Home",
                    tabBarIcon: ({size, color})=><Icon name="newspaper-outline" size={size} color={color}/>,
                    tabBarVisible: tabbarVisibility(route)
                }
            )}
            />
            <Tab.Screen
            name="ChatsStack"
            component={ChatsStack}
            options={({route}) => ({
                title: "Chats",
                tabBarIcon: ({size, color})=><Icon name="chatbox-ellipses-outline"
                size={size} color={color} />,
                tabBarVisible: tabbarVisibility(route)
            })}
            />
            <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={({route}) => ({
                title: "Profile",
                tabBarIcon: ({size, color})=><Icon name="person-outline" size={size} color={color} />,
                tabBarVisible: tabbarVisibility(route)
            })}
            />
        </Tab.Navigator>
    )
}