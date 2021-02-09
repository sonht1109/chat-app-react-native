import React from 'react'
import {Image} from 'react-native'

export default [
    {
        backgroundColor: "#a6e4d0",
        image: <Image source={require('../../../assets/img/onboarding-img1.png')} />,
        title: "Connect to the world",
        subtitle: "A new way to connect to the world"
    },
    {
        backgroundColor: "#fdeb93",
        image: <Image source={require('../../../assets/img/onboarding-img2.png')} />,
        title: "Share your favourites",
        subtitle: "Share your thoughts with similar kind of people"
    },
    {
        backgroundColor: "#e9bcbe",
        image: <Image source={require('../../../assets/img/onboarding-img3.png')} />,
        title: "Become the star",
        subtitle: "Let the spotlight capture you"
    }
]