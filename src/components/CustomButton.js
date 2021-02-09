import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function CustomButton({text, bgColor, textColor, ...rest}) {
    return (
        <TouchableOpacity {...rest} activeOpacity={0.8}>
            <Text style={[styles.button, {color: textColor, backgroundColor: bgColor}]}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        // flex: 1
        textAlign: 'center',
        paddingVertical: 15,
        borderRadius: 5
    }
})
