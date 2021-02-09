import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import pages from './pages'
import Onboarding from 'react-native-onboarding-swiper';

export default function OnBoardingPage({navigation}) {

    return (
        <Onboarding
            onSkip={() => navigation.navigate('Login')}
            onDone={() => navigation.navigate('Login')}
            pages={pages}
        />
    )
}

const styles = StyleSheet.create({})
