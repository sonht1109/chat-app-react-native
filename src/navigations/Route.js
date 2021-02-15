import React, { useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack';
import { AuthContext } from './AuthProvider';
import MainStack from './MainStack';
import { useState } from 'react/cjs/react.development';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function Route() {

    const { user, setUser } = useContext(AuthContext)
    const [initializing, setInitializing] = useState(true)

    const onAuthStateChanged = async (user) => {
        // console.log(user);
        // setUser(user)
        let userData = null
        if (user) {
            userData = {
                displayName: user.displayName ? user.displayName : "Social User",
                avt: user.photoURL,
                createAt: user.metadata.creationTime,
                phoneNumber: user.phoneNumber,
                uid: user.uid,
                email: user.email,
                about: ''
            }
            await firestore().collection('users').doc(user.uid)
                .set({ ...userData })
                .then(() => {
                    setUser({ ...userData })
                    if (initializing) setInitializing(false)
                })
        }
        else {
            setUser(null)
            if (initializing) setInitializing(false)
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber // unsubscribe on unmount
    }, [])

    if (initializing) return null

    return (
        <NavigationContainer>
            {
                user === null ?
                    <AuthStack /> :
                    <MainStack />
            }
        </NavigationContainer>
    )
}

export default Route