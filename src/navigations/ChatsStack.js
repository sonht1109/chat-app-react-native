import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Chats from '../pages/Chats/index';
import ChatDetail from '../pages/Chats/ChatDetail';
import Icon from 'react-native-vector-icons/Ionicons'

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
                    }
                }}
            />
            <Stack.Screen
                name="ChatDetail"
                component={ChatDetail}
                options={({route, navigation}) => (
                    {
                        title: 'User',
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            color: "#3c5898"
                        },
                        headerStyle: {
                            elevation: 0,
                            shadowOpacity: 0
                        },
                        headerLeft: () => <Icon name="chevron-back" color="#3c5898"
                        size={25} style={{marginLeft: 20}}
                        onPress={() => navigation.goBack()} />
                    }
                )}
            />
        </Stack.Navigator>
    )
}