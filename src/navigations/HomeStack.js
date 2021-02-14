import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home/index';
import Icon from 'react-native-vector-icons/Ionicons'
import AddPost from '../pages/Home/AddPost';

const Stack = createStackNavigator()

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Home' component={Home}
                options={({ navigation }) => ({
                    headerTitle: () => <Icon name="planet-outline" color="#3c5898" size={45} /> ,
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
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}