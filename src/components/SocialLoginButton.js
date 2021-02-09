import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default function SocialLoginButton({ text, icon, bgColor, textColor, ...rest }) {
    return (
        <TouchableOpacity {...rest} activeOpacity={0.8}>
            <View style={[{backgroundColor: bgColor, flexDirection: "row"}, styles.button]}>
                <Icon name={icon} size={25} color={textColor} />
                <Text style={{ color: textColor, marginLeft: 30 }}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        // flex: 1
        textAlign: 'center',
        paddingVertical: 15,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: 'center'
    }
})
