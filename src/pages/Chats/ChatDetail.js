import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../../navigations/AuthProvider';
import database from '@react-native-firebase/database';

export default function ChatDetail({ route }) {

    const [messages, setMessages] = useState([])
    const { guest } = route.params
    const { user } = useContext(AuthContext)


    useEffect(() => {

        const onValueChange = database()
            .ref("messages")
            .child(user.uid)
            .child(guest.uid)
            .on('value', snapshot => {
                let messages = []
                snapshot.forEach(data => {
                    const {text, user, _id, createdAt} = data.val()
                    messages.push({
                        _id,
                        user: {...user},
                        text,
                        createdAt
                    })
                })
                setMessages(messages.reverse())
            })

        return () => database().ref("messages")
            .child(user.uid)
            .child(guest.uid)
            .off('value', onValueChange)

    }, []);
    console.log(messages)

    const onSend = useCallback((messages = []) => {
        database()
            .ref('messages')
            .child(user.uid)
            .child(guest.uid)
            .push({
                _id: messages[0]._id,
                text: messages[0].text,
                createdAt: new Date().toString(),
                user: {
                    _id: user.uid,
                    name: user.displayName,
                    avatar: user.avt
                }
            })

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
        );
    }, []);

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <Icon
                        name="send-outline"
                        style={{ marginBottom: 5, marginRight: 5 }}
                        size={30}
                        color="#3c5898"
                    />
                </View>
            </Send>
        );
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#3c5898',
                    },
                    left: {
                        backgroundColor: "white"
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                }}
            />
        );
    };

    const renderChatEmpty = () => {
        return (
            <Text>Let's share something</Text>
        )
    }

    const scrollToBottomComponent = () => {
        return (
            <Icon name="caret-down-circle-outline" color="#2e64e5" size={25} />
        )
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={(mess) => onSend(mess)}
            user={{
                _id: user.uid
            }}
            renderBubble={renderBubble}
            renderSend={renderSend}
            scrollToBottom
            isTyping
            scrollToBottomComponent={scrollToBottomComponent}
            // renderChatEmpty={renderChatEmpty}
        />
    )
}