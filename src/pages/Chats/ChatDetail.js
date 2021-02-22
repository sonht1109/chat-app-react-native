import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, Image, ScrollView, Keyboard } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../navigations/AuthProvider';
import database from '@react-native-firebase/database';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import ScaledImage from '../../components/ScaledImage';
import storage from '@react-native-firebase/storage';

// const { width, height } = Dimensions.get('window')

export default function ChatDetail({ route }) {
    const [messages, setMessages] = useState([]);
    const { guest } = route.params;
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState(null)
    const databaseRef = database().ref(`messages/${user.uid}/${guest.uid}`);

    const [text, setText] = useState('')
    const [paging, setPaging] = useState(1)
    // const [isLoadingEarlier, setIsLoadingEalier] = useState(true)

    const bs = useRef()
    const fall = new Animated.Value(1)

    const toggleBottomSheet = () => {
        bs.current.snapTo(0)
    }

    const onValueChanged = useCallback(() => {
        databaseRef.limitToLast(paging * 15).on('value', snapshot => {
            let arr = []
            snapshot.forEach(data => {
                arr.unshift(data.val())
            })
            setMessages(arr)
        })
    }, [paging])

    useEffect(() => {
        onValueChanged()
        return () => databaseRef.off('value', onValueChanged)
    }, []);

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
                image: image,
                pending: true,
                sent: false,
            };
            setMessages(prev => GiftedChat.append(prev, message))
            setText('')
            setImage(null)
            if (tempImage) {
                let imageUrl = await handleUploadImage(tempImage)
                message.image = imageUrl
            }
            // push message to sender-message
            databaseRef.push({ ...message, pending: false, sent: true });
            // push message to receiver-message
            database().ref('messages').child(guest.uid).child(user.uid).push({ ...message, pending: false, sent: true });
            //if this is the first message
            if(messages.length === 0){
                database().ref('message-to-users').child(guest.uid).push({uid: user.uid})
            }
        }
    }

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
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontWeight: "700", color: "#bbb", fontSize: 20}}>Let's share something</Text>
            </View>
        );
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
                            <Icon name="close-circle-outline" size={30} color="white" onPress={() => onDeleteImageFromFooter()} />
                        </View>
                        <ScaledImage uri={image} height={80} borderRadius={10} />
                    </View>
                </View>
            )
        }
        return null
    }

    const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
        return contentSize.height - layoutMeasurement.height <= contentOffset.y
        // minus paddingtop if you need
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
                    // onLoadEarlier={() => {
                    //     console.warn('onloadealier')
                    // }}
                    // isLoadingEarlier={isLoadingEarlier}
                    listViewProps={{
                        scrollEventThrottle: 40,
                        onScroll: ({nativeEvent}) => {
                            if(isCloseToTop(nativeEvent)){
                                setPaging(prev => prev + 1)
                                onValueChanged()
                            }
                        }
                    }}
                    infiniteScroll={true}
                    user={{
                        _id: user.uid,
                    }}
                    messagesContainerStyle={{ transform: [ { scaleY: messages.length === 0 ? -1 : 1 } ] }}
                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    scrollToBottom
                    text={text}
                    onInputTextChanged={text => setText(text)}
                    scrollToBottomComponent={scrollToBottomComponent}
                    renderChatEmpty={renderChatEmpty}
                    alwaysShowSend
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