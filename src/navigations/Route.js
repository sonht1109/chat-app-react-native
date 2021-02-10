import React, { useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack';
import { AuthContext } from './AuthProvider';
import MainStack from './MainStack';
import { useState } from 'react/cjs/react.development';
import auth from '@react-native-firebase/auth';

function Route() {

    const { user, setUser } = useContext(AuthContext)
    const [initializing, setInitializing] = useState(true)

    const onAuthStateChanged = user => {
        setUser(user)
        if(initializing) setInitializing(false)
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber // unsubscribe on unmount
    }, [])

    if(initializing) return null

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