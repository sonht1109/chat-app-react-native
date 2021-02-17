import React from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Divider } from 'react-native-paper'

const messages = [
    {
        id: '1',
        userName: 'Jenny Doe',
        avt: require('../../../assets/img/users/avt-3.png'),
        messageTime: '4 mins ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '2',
        userName: 'John Doe',
        avt: require('../../../assets/img/users/avt-1.png'),
        messageTime: '2 hours ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '3',
        userName: 'Ken William',
        avt: require('../../../assets/img/users/avt-4.png'),
        messageTime: '1 hours ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '4',
        userName: 'Selina Paul',
        avt: require('../../../assets/img/users/avt-2.png'),
        messageTime: '1 day ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
        id: '5',
        userName: 'Christy Alex',
        avt: require('../../../assets/img/users/avt-5.png'),
        messageTime: '2 days ago',
        messageText:
            'Hey there, this is my test for a post of my social app in React Native.',
    },
]

export default function Chats({navigation}) {

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
            style={styles.messageItemWrapper}
            onPress={() => navigation.navigate('ChatDetail')}
            >
                <View style={styles.messageItem}>
                    <View style={{ width: 50, height: 50, borderRadius: 50, overflow: 'hidden' }}>
                        <Image
                            source={item.avt}
                            style={{
                                resizeMode: "contain",
                                flex: 1,
                                aspectRatio: 1,
                            }}
                        />
                    </View>
                    <View style={{ marginLeft: 10, flexGrow: 1, flexShrink: 1}}>
                        <View style={styles.nameDateWrapper}>
                            <Text style={styles.name}>{item.userName}</Text>
                            <Text style={styles.time}>{item.messageTime}</Text>
                        </View>
                        <Text numberOfLines={1}>{item.messageText}</Text>
                    </View>
                </View>
                {
                    index !== messages.length - 1 &&
                    <Divider />
                }
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <FlatList
                contentContainerStyle={styles.container}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
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
