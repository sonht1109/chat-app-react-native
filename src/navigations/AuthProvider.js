import React, { useState } from 'react'
import { createContext } from 'react'
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { GoogleSignin } from '@react-native-community/google-signin';

export const AuthContext = createContext()

function AuthProvider({children}){

    const [user, setUser] = useState(null)

    return(
        <AuthContext.Provider value={{
            user, setUser,
            login: async(email, password) => {
                try{
                    await auth().signInWithEmailAndPassword(email, password)
                }
                catch(e){
                    console.warn(e)
                }
            },
            signup: async(email, password) => {
                try{
                    await auth().createUserWithEmailAndPassword(email, password)
                    Alert.alert('Sign up successful !')
                }
                catch(e){
                    console.warn(e)
                }
            },
            logout: async() => {
                try{
                    await auth().signOut()
                }
                catch(e){
                    console.warn(e)
                }
            },
            googleLogin: async() => {
                try{
                    const {idToken} = await GoogleSignin.signIn()
                    const googleCredential = auth.GoogleAuthProvider.credential(idToken)
                    await auth().signInWithCredential(googleCredential)
                }
                catch(e){
                    console.log(e)
                }
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider