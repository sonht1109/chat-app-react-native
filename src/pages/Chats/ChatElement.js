import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import CustomAvatar from '../../components/CustomAvatar';

export default function ChatElement({hasBorder, navigation, guestId}) {

    const [guest, setGuest] = useState({
        avt: null,
        displayName: '',
        uid: guestId
    })

    useEffect(() => {
        const subscriber = firestore()
        .collection('users')
        .doc(guestId)
        .onSnapshot(doc => {
            const {avt, displayName} = doc.data()
            setGuest({
                ...guest,
                avt: avt,
                displayName: displayName
            })
        }, e => console.log('err in snapshot user', e))
        return () => subscriber()
    }, [])

    return (
        <TouchableOpacity
            style={styles.messageItemWrapper}
            onPress={() => navigation.navigate('ChatDetail', {
                guest: guest
            })}
            >
                <View style={styles.messageItem}>
                    <CustomAvatar uri={guest.avt} displayName={guest.displayName} size={50} />
                    <View style={{ marginLeft: 10, flexGrow: 1, flexShrink: 1}}>
                        <View style={styles.nameDateWrapper}>
                            <Text style={styles.name}>{guest.displayName}</Text>
                            {/* <Text style={styles.time}>{item.messageTime}</Text> */}
                        </View>
                        {/* <Text numberOfLines={1}>{item.messageText}</Text> */}
                    </View>
                </View>
                {
                    hasBorder &&
                    <Divider />
                }
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
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
