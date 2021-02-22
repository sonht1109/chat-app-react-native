import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/index';
import Icon from 'react-native-vector-icons/Ionicons'
import AddPost from '../pages/Home/AddPost';
import Profile from '../pages/Profile/index';
import Search from '../pages/Search/index';

const Stack = createStackNavigator()

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Home' component={Home}
                options={({ navigation }) => ({
                    headerTitleAlign: "center",
                    headerStyle: {
                        elevation: 0
                    },
                    headerLeft: () => <Icon name="search-outline" color="#3c5898" size={25}
                    onPress={() => navigation.navigate("Search")} />,
                    headerRight: () => <Icon name="add-outline" color="#3c5898" size={25}
                        onPress={() => navigation.navigate("AddPost")} />,
                    headerRightContainerStyle: {
                        marginRight: 20
                    },
                    headerLeftContainerStyle: {
                        marginLeft: 20
                    }
                })}
            />
            <Stack.Screen
                name="AddPost"
                component={AddPost}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="UserProfile"
                component={Profile}
                options={{
                    title: '',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Search"
                component={Search}
                options={{
                    title: '',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}