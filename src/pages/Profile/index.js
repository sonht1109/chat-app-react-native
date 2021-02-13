import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../../navigations/AuthProvider';

export default function Profile() {
    const {user, logout} = useContext(AuthContext)
    console.log(user)
    return (
        <View>
            <Text>{user.displayName}, {user.uid}</Text>
            <Text onPress={logout}>Log out</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
