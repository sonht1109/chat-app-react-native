import React, { useState } from 'react'
import { Keyboard, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore';

export default function Search() {

    const [keyword, setKeyword] = useState('')

    const onSearch = async () => {
        if(keyword.trim() !== ''){
            console.log(keyword)
            await firestore()
            .collection('users')
            .where('displayName', 'array-contains', keyword)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data().displayName)
                })
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <TextInput
                placeholder="User Name..."
                style={styles.input}
                autoFocus
                value={keyword}
                onChangeText={text => setKeyword(text)}
                onSubmitEditing={onSearch}
                />
                <Icon name="search-outline" size={20} color="#3c5898" onPress={() => {
                    onSearch()
                    Keyboard.dismiss()
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#bbb",
        margin: 10,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    input: {
        flexGrow: 1,
        color: "#666"
    }
})
