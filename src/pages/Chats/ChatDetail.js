import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../navigations/AuthProvider';
import database from '@react-native-firebase/database';

export default function ChatDetail({ route }) {
    const [messages, setMessages] = useState([]);
    const { guest } = route.params;
    const { user } = useContext(AuthContext);
    const databaseRef = database().ref(`messages/${user.uid}/${guest.uid}`);

    useEffect(() => {
        let arr = [];
        databaseRef.once('value', (snapshot) => {
            snapshot.forEach((data) => {
                arr.unshift(data.val());
            });
        });
        setMessages(arr);
    }, []);
    console.log(messages);

    const onSend = useCallback((messages = []) => {
        const message = {
            _id: messages[0]._id,
            text: messages[0].text,
            createdAt: new Date().toString(),
            user: {
                _id: user.uid,
                name: user.displayName,
                avatar: user.avt,
            },
        };
        // push message to sender-message
        databaseRef.push(message);
        // push message to receiver-message
        database().ref('messages').child(guest.uid).child(user.uid).push(message);

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
                        style={{ marginBottom: 10, marginRight: 5, }}
                        size={25}
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
                        backgroundColor: 'white',
                    },
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
        return <Text>Let's share something</Text>;
    };

    const scrollToBottomComponent = () => {
        return <Icon name="caret-down-circle-outline" color="#2e64e5" size={25} />;
    };

    const renderActions = ()=> {
        return <Icon name="camera-outline" size={25} color="#3c5898" style={{alignSelf: "center", marginLeft: 5}} />
    }

    return (
        <View style={{flex: 1}}>
            <GiftedChat
            messages={messages}
            onSend={(mess) => onSend(mess)}
            user={{
                _id: user.uid,
            }}
            renderBubble={renderBubble}
            renderSend={renderSend}
            scrollToBottom
            isTyping
            scrollToBottomComponent={scrollToBottomComponent}
            renderChatEmpty={renderChatEmpty}
            isLoadingEarlier
            placeholder="Aa"
            renderActions={renderActions}
        />
        </View>
    );
}
