import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Chats from '../pages/Chats/index';
import ChatDetail from '../pages/Chats/ChatDetail';
import Icon from 'react-native-vector-icons/Ionicons'
import CustomBackArrow from './CustomBackArrow';

const Stack = createStackNavigator()

export default function ChatsStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Chats"
                component={Chats}
                options={{
                    headerTitleAlign: "center",
                    headerTintColor: "#3c5898",
                    headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0
                    },
                    headerTitleStyle: {
                        fontWeight: "bold"
                    },
                    headerTitle: () => <Icon name="chatbox-ellipses-outline" size={40} color="#3c5898" />
                }}
            />
            <Stack.Screen
                name="ChatDetail"
                component={ChatDetail}
                options={({route, navigation}) => (
                    {
                        title: "User",
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            color: "#3c5898"
                        },
                        headerStyle: {
                            elevation: 0,
                            shadowOpacity: 0
                        },
                        headerLeft: () => <CustomBackArrow navigation={navigation} />
                    }
                )}
            />
        </Stack.Navigator>
    )
}