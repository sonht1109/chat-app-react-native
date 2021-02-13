import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Chats from '../pages/Chats/index';
import ChatDetail from '../pages/Chats/ChatDetail';

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
                    }
                }}
            />
            <Stack.Screen
                name="ChatDetail"
                component={ChatDetail}
                options={({route}) => (
                    {
                        title: 'User',
                        headerTitleAlign: "center"
                    }
                )}
            />
        </Stack.Navigator>
    )
}