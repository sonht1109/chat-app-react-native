import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../../navigations/AuthProvider';

export default function Home() {

    const {user, logout} = useContext(AuthContext)

    return (
        <View style={styles.container}>
            <Text>User ID: {user.uid}</Text>
            <Text onPress={logout}>LOG OUT</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
