import React, { useContext, useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, } from 'react-native'
import ChatElement from './ChatElement';
import database from '@react-native-firebase/database';
import { AuthContext } from '../../navigations/AuthProvider';

export default function Chats({navigation}) {

    const {user} = useContext(AuthContext)

    const [users, setUsers] = useState([])

    useEffect(() => {
        const onValueChange = database()
        .ref('message-to-users')
        .child(user.uid)
        .on('value', snapshot => {
            let users = []
            snapshot.forEach(data => {
                const {uid} = data.val()
                users.push({
                    uid
                })
            })
            setUsers(users)
        })
        return () => database()
        .ref('message-to-users')
        .child(user.uid)
        .off('value', onValueChange)
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <FlatList
                contentContainerStyle={styles.container}
                data={users}
                renderItem={({item, index}) => <ChatElement navigation={navigation} guestId={item.uid} hasBorder={index !== users.length - 1} /> }
                keyExtractor={item => item.uid}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginBottom: 20
    },
    messageItemWrapper: {
        // flexGrow: 1,
    },
    messageItem: {
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: 'center'
    },
    nameDateWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontWeight: "bold",
        fontSize: 16
    },
    time: {
        color: "#666",
        fontSize: 12
    }
})
