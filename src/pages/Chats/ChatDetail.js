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
import storage from '@react-native-firebase/storage';
import { ActivityIndicator } from 'react-native-paper';

// const { width } = Dimensions.get('screen')

export default function ChatDetail({ route }) {
    const [messages, setMessages] = useState([]);
    const { guest } = route.params;
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState(null)
    const databaseRef = database().ref(`messages/${user.uid}/${guest.uid}`);

    const [sendingImage, setSendingImage] = useState(false)
    const [text, setText] = useState('')

    const bs = useRef()
    const fall = new Animated.Value(1)

    const toggleBottomSheet = () => {
        bs.current.snapTo(0)
    }

    useEffect(() => {
        const onAddChild = databaseRef.on('child_added', data => {
            setMessages((prev) => {
                prev.unshift(data.val())
                return [...prev]
            })
        })
        return () => databaseRef.off('child_added', onAddChild)
    }, []);

    const onSend = useCallback((messData = []) => {
        const message = {
            _id: messData[0]._id,
            text: messData[0].text,
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

        // setMessages((previousMessages) =>
        //     GiftedChat.append(previousMessages, messages),
        // );
        // GiftedChat.append(messages.unshift(message))
        setImage(null)
    }, [image]);

    const handleUploadImage = async (image) => {
        let imgUrl = null
        if (image) {
            const fileName = image.substring(image.lastIndexOf('/') + 1)
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
            fileName.substring(0, fileName.lastIndexOf('.')) + '-' + Date.now()
            const timeStamp = fileName.substring(0, fileName.lastIndexOf('.')) + '-' + Date.now()

            const storageRef = storage().ref(`messageImages/${user.uid}_${guest.uid}/${timeStamp}.${extension}`)

            await storageRef.putFile(image)
                .then(async () => {
                    imgUrl = await storageRef.getDownloadURL()
                    setImage(null)
                })
                .catch(e => console.log('err in storing avt', e))
        }
        return imgUrl
    }

    const handleCustomOnSend = async (messageIdGenerator) => {
        if (image || text !== '') {
            let tempImage = image
            const message = {
                _id: messageIdGenerator(),
                text: text,
                createdAt: new Date().toString(),
                user: {
                    _id: user.uid,
                    name: user.displayName,
                    avatar: user.avt,
                },
                image: null
            };
            setText('')
            setImage(null)
            if (tempImage) {
                let imageUrl = await handleUploadImage(tempImage)
                message.image = imageUrl
            }
            // push message to sender-message
            databaseRef.push(message);
            // push message to receiver-message
            database().ref('messages').child(guest.uid).child(user.uid).push(message);
            if(sendingImage) setSendingImage(false)
        }
    }
    console.log(sendingImage)


    const renderSend = (props) => {
        const { sendButtonProps, messageIdGenerator, onSend } = props
        return (
            <Send {...props} sendButtonProps={{
                ...sendButtonProps, onPress: () => {
                    handleCustomOnSend(messageIdGenerator, onSend)
                }
            }}>
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
            // setImage(prev => [...prev, image.path])
            setImage(image.path)
            bs.current.snapTo(1)
        })
            .catch(err => console.log(err))
    }

    const handleGetPhotoFromGallery = () => {
        ImagePicker.openPicker({
            cropping: true,
            compressImageQuality: 0.6
        }).then(image => {
            /**
             * if you want to choose multiple images
             */
            // let arr = []
            // images.forEach(item => {
            //     if (!image.includes(item.path)) {
            //         arr.push(item.path)
            //     }
            // })
            // setImage(prev => [...prev, ...arr])
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

    const onDeleteImageFromFooter = () => {
        // let arr = image.slice(0, index).concat(image.slice(index + 1))
        // setImage([...arr])
        setImage(null)
    }

    const renderChatFooter = () => {
        if (image) {
            return (
                // <View style={{ height: 80, backgroundColor: "transparent" }}>
                //     <ScrollView
                //         horizontal
                //         showsHorizontalScrollIndicator={false}
                //     >
                //         {
                //             image.length && image.map((item, index) => {
                //                 return (
                //                     <View
                //                     style={{ position: 'relative', marginHorizontal: 5 }}
                //                     key={'image' + index}>
                //                         <View style={styles.chatFooterImageWrapper}>
                //                             <Icon name="close-circle-outline" size={30} color="white" onPress={() => onDeleteImageFromFooter(index)} />
                //                         </View>
                //                         <ScaledImage uri={item} height={80} borderRadius={10} />
                //                     </View>
                //                 )
                //             })
                //         }
                //     </ScrollView>
                // </View>
                <View style={{ alignItems: "center" }}>
                    <View
                        style={{ position: 'relative', marginHorizontal: 5, alignSelf: "flex-end" }}>
                        <View style={styles.chatFooterImageWrapper}>
                            {
                                sendingImage ?
                                    <ActivityIndicator size={20} color="white" /> :
                                    <Icon name="close-circle-outline" size={30} color="white" onPress={() => onDeleteImageFromFooter()} />
                            }
                        </View>
                        <ScaledImage uri={image} height={80} borderRadius={10} />
                    </View>
                </View>
            )
        }
        return null
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
                    onSend={mess => onSend(mess)}
                    user={{
                        _id: user.uid,
                    }}
                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    scrollToBottom
                    text={text}
                    isTyping
                    onInputTextChanged={text => setText(text)}
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
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10
    }
})