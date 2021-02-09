import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import CustomButton from '../../components/CustomButton';
import SocialLoginButton from '../../components/SocialLoginButton';
import Icon from 'react-native-vector-icons/Ionicons'
import FormInput from '../../components/FormInput';

export default function Login() {
    return (
        <View style={styles.container}>
            <View style={styles.logoWrapper}>
                <Icon name="chatbubbles-outline" size={100} color="#3c5898" />
            </View>

            <Text style={styles.title}>RN Chat App</Text>

            <View>
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Username"
                        icon="person-outline"
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Password"
                        icon="lock-closed-outline"
                        secure={true}
                    />
                </View>
                <CustomButton
                    bgColor="#3c5898"
                    text="Log In"
                    textColor="white"
                    style={{ marginVertical: 10 }}
                />
            </View>

            <Text style={styles.forgotPassword} onPress={() => console.warn('Forgot password')}>
                Forgot password ?
            </Text>

            <SocialLoginButton
                text="Login with Facebook"
                icon="logo-facebook"
                textColor="#3c5898"
                bgColor="#c7cbd4"
                style={{ marginVertical: 10 }}
            />

            <SocialLoginButton
                text="Login with Google"
                icon="logo-google"
                textColor="#e34a39"
                bgColor="#ffbfba"
                style={{ marginVertical: 10 }}
            />

            <Text style={styles.forgotPassword} onPress={() => console.warn("Sign up")}>
                Don't have an account ? Sign up here
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    logoWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        marginVertical: 20
    },
    forgotPassword: {
        textAlign: 'center',
        color: "#3c5898",
        marginVertical: 10
    }
})
