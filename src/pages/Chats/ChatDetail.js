import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../navigations/AuthProvider';
import database from '@react-native-firebase/database';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import ScaledImage from '../../components/ScaledImage';

// const { width } = Dimensions.get('screen')

export default function ChatDetail({ route }) {
    const [messages, setMessages] = useState([]);
    const { guest } = route.params;
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState([])
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
            image: image
        };
        // push message to sender-message
        databaseRef.push(message);
        // push message to receiver-message
        database().ref('messages').child(guest.uid).child(user.uid).push(message);

        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages),
        );
        setImage([])
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
            cropping: true,
        }).then(image => {
            setImage(prev => [...prev, image.path])
            bs.current.snapTo(1)
        })
            .catch(err => console.log(err))
    }

    const handleGetPhotoFromGallery = () => {
        ImagePicker.openPicker({
            multiple: true,
        }).then(images => {
            let arr = []
            images.forEach(item => {
                if (!image.includes(item.path)) {
                    arr.push(item.path)
                }
            })
            setImage(prev => [...prev, ...arr])
            bs.current.snapTo(1)
        })
            .catch(err => console.log(err))
    }
    console.log(image)


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

    const onDeleteImageFromFooter = (index) => {
        let arr = image.slice(0, index).concat(image.slice(index+1))
        setImage([...arr])
    }

    const renderChatFooter = () => {
        if (image.length) {
            return (
                <View style={{ height: 80, backgroundColor: "transparent" }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            image.length && image.map((item, index) => {
                                return (
                                    <View style={{ position: 'relative', marginHorizontal: 5 }}>
                                        <View style={styles.chatFooterImageWrapper}>
                                            <Icon name="close-circle-outline" size={30} color="white" onPress={() => onDeleteImageFromFooter(index)} />
                                        </View>
                                        <ScaledImage uri={item} height={80} borderRadius={10} />
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            )
        }
        return null
    }

    console.log(image)

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
                    // renderChatEmpty={renderChatEmpty}
                    alwaysShowSend
                    isLoadingEarlier
                    placeholder="Aa"
                    renderActions={renderActions}
                    renderChatFooter={renderChatFooter}
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
    chatFooterImageWrapper: {
        position: "absolute",
        borderRadius: 10,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10
    }
})