import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons'
import FormInput from '../../components/FormInput';
import { AuthContext } from '../../navigations/AuthProvider';
import { displayName } from 'react-native/Libraries/ReactNative/RootTagContext';

export default function Signup({navigation}) {

    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        displayName: ""
    })

    const {signup} = useContext(AuthContext)

    const checkSignUp = () => {
        return data.password === data.confirmPassword
    }

    const checkName = () => {
        return data.displayName.length > 0
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoWrapper}>
                <Icon name="planet-outline" size={100} color="#3c5898" />
            </View>

            <Text style={styles.title}>Mowx Social</Text>

            <View>
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Email"
                        icon="mail-outline"
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
                <View style={{ marginVertical: 10 }}>
                    <FormInput
                        placeholder="Display Name"
                        icon="person-outline"
                        value={data.displayName}
                        onChangeText={(val) => setData({...data, displayName: val})}
                    />
                </View>

                <CustomButton
                    bgColor="#3c5898"
                    text="Sign Up"
                    textColor="white"
                    style={{ marginVertical: 10 }}
                    onPress={() => {
                        if(!checkSignUp()){
                            Alert.alert('Password not matches')
                        }
                        if(!checkName()){
                            Alert.alert('Name must be filled')
                        }
                        else signup(data.email, data.password, data.displayName)
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
        marginVertical: 20,
        color: "#3c5898"
    },
    forgotPassword: {
        textAlign: 'center',
        color: "#3c5898",
        marginVertical: 10
    }
})
