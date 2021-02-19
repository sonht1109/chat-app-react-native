import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../navigations/AuthProvider';
import database from '@react-native-firebase/database';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';

export default function ChatDetail({ route }) {
    const [messages, setMessages] = useState([]);
    const { guest } = route.params;
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState(null)
    const databaseRef = database().ref(`messages/${user.uid}/${guest.uid}`);

    const bs = useRef()
    const fall = new Animated.Value(1)

    const toggleBottomSheet = () => {
        bs.current.snapTo(0)
    }

    useEffect(() => {
        let arr = [];
        databaseRef.once('value', (snapshot) => {
            snapshot.forEach((data) => {
                arr.unshift(data.val());
            });
        });
        setMessages(arr);
    }, []);

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

    const renderActions = () => {
        return <Icon name="camera-outline" size={25} color="#3c5898" style={{ alignSelf: "center", marginLeft: 5 }} onPress={toggleBottomSheet} />
    }

    const renderHeader = () => {
        return (
            <View style={styles.bsHeader}>
                <Icon name="remove-outline" color="black" size={30} />
            </View>
        )
    }

    const handleTakeAPhoto = () => {
        ImagePicker.openCamera({
            compressImageQuality: 0.6,
            width: 300,
            height: 300,
            cropping: true,
        }).then(image => {
            setImage(image.path)
            bs.current.snapTo(1)
        })
            .catch(err => console.log(err))
    }

    const handleGetPhotoFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            setImage(image.path)
            bs.current.snapTo(1)
        })
            .catch(err => console.log(err))
    }

    const renderContent = () => {
        return (
            <View style={styles.bsContent}>
                <TouchableOpacity activeOpacity={0.8}
                onPress={handleTakeAPhoto}>
                    <Text style={styles.bsButton}>Take a photo</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8}
                onPress={handleGetPhotoFromGallery}>
                    <Text style={styles.bsButton}>Choose from gallery</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <BottomSheet
                ref={bs}
                snapPoints={[220, 0]}
                initialSnap={1}
                callbackNode={fall}
                renderContent={renderContent}
                renderHeader={renderHeader}
                enabledGestureInteraction
                enabledContentGestureInteraction={false}
            />
            <Animated.View style={{ flex: 1, opacity: Animated.add(0.3, Animated.multiply(fall, 1)) }}>
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
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    bsContent: {
        backgroundColor: "white",
        padding: 10
    },
    bsButton: {
        textAlign: "center",
        color: "white",
        backgroundColor: "#3c5898",
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10
    },
    bsHeader: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: "black",
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "white",
        paddingVertical: 10,
        shadowOffset: { //ios
            width: 10,
            height: 10
        },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 2 //android,
    },
})