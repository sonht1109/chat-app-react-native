import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import CustomButton from '../../components/CustomButton';
import SocialLoginButton from '../../components/SocialLoginButton';
import Icon from 'react-native-vector-icons/Ionicons'
import FormInput from '../../components/FormInput';
import { AuthContext } from '../../navigations/AuthProvider';

export default function Login({navigation}) {

    const {login, googleLogin} = useContext(AuthContext)

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    return (
        <View style={styles.container}>
            <View style={styles.logoWrapper}>
                <Icon name="chatbubbles-outline" size={100} color="#3c5898" />
            </View>

            <Text style={[styles.title, styles.customFont]}>RN Chat App</Text>

            <View>
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Username"
                        icon="person-outline"
                        value={data.email}
                        onChangeText={val => setData({...data, email: val})}
                    />
                </View>
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Password"
                        icon="lock-closed-outline"
                        secure={true}
                        value={data.password}
                        onChangeText={val => setData({...data, password: val})}
                    />
                </View>
                <CustomButton
                    bgColor="#3c5898"
                    text="Log In"
                    textColor="white"
                    style={{ marginVertical: 10 }}
                    onPress={() => login(data.email, data.password)}
                />
            </View>

            <Text style={styles.forgotPassword} onPress={() => console.warn('Forgot pass')}>
                Forgot password ?
            </Text>

            <SocialLoginButton
                text="Login with Facebook"
                icon="logo-facebook"
                textColor="#3c5898"
                bgColor="#becbe8"
                style={{ marginVertical: 10 }}
            />

            <SocialLoginButton
                text="Login with Google"
                icon="logo-google"
                textColor="#e34a39"
                bgColor="#ffbfba"
                style={{ marginVertical: 10 }}
                onPress={() => googleLogin()}
            />

            <Text style={[styles.forgotPassword]} onPress={() => {navigation.navigate('Signup')}}>
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
    },
    customFont: {
        fontFamily: 'NunitoSans'
    }
})
