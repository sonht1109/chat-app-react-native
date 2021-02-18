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

    const onAuthStateChanged = async (userResponse) => {
        // setUser(user)
        if (userResponse) {
            await firestore().collection('users').doc(userResponse.uid)
            .get()
            .then(async (doc) => {
                if(!doc.exists){
                    let userData = {
                        displayName: userResponse.displayName ? userResponse.displayName : "Social User",
                        avt: userResponse.photoURL,
                        createAt: userResponse.metadata.creationTime,
                        phoneNumber: userResponse.phoneNumber,
                        uid: userResponse.uid,
                        email: userResponse.email,
                        about: '',
                        followings: [],
                        followers: []
                    }
                    await firestore().collection('users').doc(userResponse.uid)
                        .set({ ...userData })
                        .then(() => {
                            setUser({ ...userData })
                        })
                        .catch(e => console.log("err in setting userdata", e))
                }
                else{
                    setUser({...doc.data()})
                }
            })
            .catch(e => console.log('err in user data', e))
        }
        else {
            setUser(null)
        }
        console.log(user);
        if (initializing) setInitializing(false)
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