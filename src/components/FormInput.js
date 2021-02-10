import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default function FormInput({secure, icon, placeholder, value, onChangeText}) {
    return (
        <View style={styles.inputWrapper}>
            <View style={styles.icon}>
                <Icon name={icon} size={25} color="#525252"/>
            </View>
            <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            secureTextEntry={secure}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize='none'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputWrapper: {
        borderWidth: 1,
        borderColor: "#525252",
        flexDirection: "row",
        alignItems: "center"
    },
    textInput: {
        marginHorizontal: 10,
        flex: 1,
    },
    icon: {
        padding: 10,
        borderRightWidth: 1,
        borderColor: "#525252"
    }
})
