import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Login() {
    return (
        <View style={styles.container}>
            <Text>This is login page</Text>
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
