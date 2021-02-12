import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/index';
import Icon from 'react-native-vector-icons/Ionicons'
import AddPost from '../pages/Home/AddPost';
import { Text, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator()

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Home' component={Home}
                options={({ navigation }) => ({
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
                    headerRight: () => <Icon name="add-outline" color="#3c5898" size={25}
                        onPress={() => navigation.navigate("AddPost")} />,
                    headerRightContainerStyle: {
                        marginRight: 20
                    }
                })}
            />
            <Stack.Screen
                name="AddPost"
                component={AddPost}
                options={({ navigation }) => ({
                    title: '',
                    headerStyle: {
                        elevation: 0,
                        backgroundColor: "transparent"
                    },
                    headerLeft: () => <Icon name="chevron-back" color="#3c5898" size={30}
                        onPress={() => navigation.goBack()} />,
                    headerLeftContainerStyle: {
                        marginLeft: 10
                    },
                    headerRight: () => (
                        <TouchableOpacity>
                            <Text style={{
                                marginRight: 20, fontWeight: 'bold',
                                fontSize: 18, color: "#3c5898"
                            }}>Post</Text>
                        </TouchableOpacity>
                    )
                })}
            />
        </Stack.Navigator>
    )
}