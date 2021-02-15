import React, { useState } from 'react'
import { createContext } from 'react'
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext()

// const getProvider = providerId => {
//     switch (providerId) {
//         case auth.GoogleAuthProvider.PROVIDER_ID:
//             return auth.GoogleAuthProvider
//         case auth.FacebookAuthProvider.PROVIDER_ID:
//             return auth.FacebookAuthProvider
//     }
// }

// const getCredential = async(provider) => {
//     try{
//         let value = await AsyncStorage.getItem(provider)
//         if(value !== null){
//             return getProvider(provider).credential(value)
//             // return auth.GoogleAuthProvider.credential(value)
//         }
//     }
//     catch(e){
//         console.log(e)
//     }
// }

// const saveCredential = async(provider, token) => {
//     try{
//         await AsyncStorage.setItem(provider, token)
//     }
//     catch(e){
//         console.log(e)
//     }
// }

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login: async (email, password) => {
                try {
                    await auth().signInWithEmailAndPassword(email, password)
                }
                catch (e) {
                    // Alert.alert('Email login: ', e.code)
                    console.warn(e)
                }
            },
            signup: async (email, password, displayName) => {
                console.log(displayName);
                try {
                    await auth().createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        firestore().collection('users').doc(auth().currentUser.uid)
                        .set({
                            displayName: displayName,
                            email: email,
                            createAt: firestore.Timestamp.fromDate(new Date()),
                            avt: null,
                        })
                    })
                    .catch(e => console.log('sign up with email', e))
                    Alert.alert('Sign up successful !')
                }
                catch (e) {
                    console.warn(e)
                }
            },
            logout: async () => {
                try {
                    await auth().signOut()
                    await GoogleSignin.revokeAccess()
                }
                catch (e) {
                    console.warn(e)
                }
            },
            googleLogin: async () => {
                try {
                    const { idToken } = await GoogleSignin.signIn()
                    // await saveCredential(auth.GoogleAuthProvider.PROVIDER_ID, idToken)
                    const googleCredential = auth.GoogleAuthProvider.credential(idToken)
                    await auth().signInWithCredential(googleCredential)
                    .then(res => {
                        const {user} = res
                        const avt = res.additionalUserInfo.profile.picture
                        firestore().collection('users').doc(user.uid)
                        .set({
                            displayName: user.displayName,
                            email: user.email,
                            createAt: firestore.Timestamp.fromDate(new Date()),
                            avt: avt,
                        })
                    })
                }
                catch (e) {
                    console.warn(e)
                }
            },
            facebookLogin: async () => {
                // let email = ''
                try {
                    const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])
                    if (result.isCancelled) {
                        throw 'User cancelled the login process'
                    }

                    const data = await AccessToken.getCurrentAccessToken()
                    if (!data) {
                        throw 'Something went wrong obtaining access token'
                    }

                    // await saveCredential(auth.FacebookAuthProvider.PROVIDER_ID, data.accessToken)

                    // await fetch('https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,friends&access_token=' + data.accessToken)
                    //     .then(res => res.json())
                    //     .then(json => email = json.email)
                    //     .catch(err => console.log(err))

                    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken)
                    await auth().signInWithCredential(facebookCredential)
                    .then(res => {
                        const {user} = res
                        const avt = res.additionalUserInfo.profile.picture.data.url
                        firestore().collection('users').doc(user.uid)
                        .set({
                            displayName: user.displayName,
                            email: user.email,
                            createAt: firestore.Timestamp.fromDate(new Date()),
                            avt: avt,
                        })
                    })
                        // .catch(async (e) => {
                        //     try {
                        //         if (e.code === "auth/account-exists-with-different-credential") {
                        //             let methods = await auth().fetchSignInMethodsForEmail(email)
                        //             let linkedProvider = await getCredential(methods[0])
                        //             let user = await auth().signInWithCredential(linkedProvider)
                        //             await auth().currentUser.linkWithCredential(user)
                        //         }
                        //     }
                        //     catch (e) {
                        //         console.log(e)
                        //     }
                        // })
                }
                catch (e) {
                    console.log(e)
                }
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider