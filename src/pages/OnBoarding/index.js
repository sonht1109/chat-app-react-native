import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import pages from './pages'
import Onboarding from 'react-native-onboarding-swiper';
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnBoardingPage({ navigation }) {

    const DoneButtonComponent = props => {
        return (
            <TouchableOpacity style={styles.doneButton} {...props}>
                <Text style={{ fontWeight: 'bold' }}>Get started</Text>
            </TouchableOpacity>
        )
    }

    return (
        <Onboarding
            nextLabel={<Icon name="chevron-forward-outline" size={25} color="black" />}
            onSkip={() => navigation.navigate('Login')}
            onDone={async () => {
                try {
                    AsyncStorage.setItem('firstLaunch', 'false')
                    navigation.navigate('Login')
                }
                catch (e) {
                    console.log(e)
                }
            }}
            DoneButtonComponent={DoneButtonComponent}
            pages={pages}
        />
    )
}

const styles = StyleSheet.create({
    doneButton: {
        flexDirection: 'row',
        marginRight: 20,
        alignItems: "center",
    }
})
