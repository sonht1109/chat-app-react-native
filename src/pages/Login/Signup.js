import React, { useContext, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import CustomButton from '../../components/CustomButton';
import SocialLoginButton from '../../components/SocialLoginButton';
import Icon from 'react-native-vector-icons/Ionicons'
import FormInput from '../../components/FormInput';
import { AuthContext } from '../../navigations/AuthProvider';

export default function Signup({navigation}) {

    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const {signup} = useContext(AuthContext)

    const checkSignUp = () => {
        return data.password === data.confirmPassword
    }

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
                        value={data.email}
                        onChangeText={(val) => setData({...data, email: val})}
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Password"
                        icon="lock-closed-outline"
                        secure={true}
                        value={data.password}
                        onChangeText={(val) => setData({...data, password: val})}
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Confirm password"
                        icon="lock-closed-outline"
                        secure={true}
                        value={data.confirmPassword}
                        onChangeText={(val) => setData({...data, confirmPassword: val})}
                    />
                </View>

                <CustomButton
                    bgColor="#3c5898"
                    text="Sign Up"
                    textColor="white"
                    style={{ marginVertical: 10 }}
                    onPress={() => {
                        if(checkSignUp()){
                            signup(data.email, data.password)
                        }
                        else Alert.alert('Password not matches')
                    }}
                />

            </View>

            <Text style={styles.forgotPassword} onPress={() => navigation.navigate('Login')}>
                Have an account ? Log in here
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
