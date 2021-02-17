import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Title, TextInput } from 'react-native-paper'
// import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet from 'reanimated-bottom-sheet'
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import CustomAvatar from '../../components/CustomAvatar';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default function EditProfile({ navigation, route }) {

    const user = route.params.userData

    const [avtImg, setAvtImg] = useState(user.avt)
    const [userData, setUserData] = useState({ ...user })
    const bs = useRef()
    const fall = new Animated.Value(1)
    const [loading, setLoading] = useState(false)
    // 1: hide, 0: show

    useEffect(() => async () => {
        Keyboard.addListener("keyboardDidShow", () => {
            if (bs.current) {
                bs.current.snapTo(1)
            }
        })
        await firestore()
            .collection('users')
            .doc(userData.uid)
            .get()
            .then(doc => setUserData({ ...doc.data() }))
            .catch(e => console.log('err in fetching userdata', e))
    }, [])

    const deleteCurrentAvatarFromStorage = async () => {
        if (userData.avt && userData.avt !== avtImg) {
            const storageRef = storage().refFromURL(userData.avt)
            console.log(storageRef);
            const imageRef = storage().ref(storageRef.fullPath)
            await imageRef
                .delete()
                .then(() => console.log('avt deleted'))
                .catch(e => console.log('Err in delete img', e))
        }
    }

    const handleUploadImage = async () => {
        let imgUrl = null
        if (avtImg) {
            const fileName = avtImg.substring(avtImg.lastIndexOf('/') + 1)
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
            fileName.substring(0, fileName.lastIndexOf('.')) + '-' + Date.now()
            const timeStamp = fileName.substring(0, fileName.lastIndexOf('.')) + '-' + Date.now()

            const storageRef = storage().ref(`userAvatars/${timeStamp}.${extension}`)

            await storageRef.putFile(avtImg)
                .then(() => {
                    imgUrl = storageRef.getDownloadURL()
                })
                .catch(e => console.log('err in storing avt', e))
        }
        return imgUrl
    }

    const handleTakeAPhoto = () => {
        ImagePicker.openCamera({
            compressImageQuality: 0.6,
            width: 300,
            height: 300,
            cropping: true,
        }).then(image => {
            setAvtImg(image.path)
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
            setAvtImg(image.path)
            bs.current.snapTo(1)
        })
            .catch(err => console.log(err))
    }

    const handleDiscardAvatar = () => {
        setAvtImg(null)
        bs.current.snapTo(1)
    }

    const renderContent = () => {
        return (
            <View style={styles.bsContent}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleTakeAPhoto}
                    style={[styles.button, { backgroundColor: "#3c5898" }]}
                >
                    <Text style={{ color: 'white' }}>Take a photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleGetPhotoFromGallery}
                    activeOpacity={0.8}
                    style={[styles.button, { backgroundColor: "#3c5898" }]}
                >
                    <Text style={{ color: 'white' }}>Choose from gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button, { backgroundColor: "#3c5898" }]}
                    onPress={handleDiscardAvatar}
                >
                    <Text style={{ color: 'white' }}>Discard avatar</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderHeader = () => {
        return (
            <View style={styles.bsHeader}>
                <Icon name="remove-outline" color="black" size={30} />
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>Update your avatar</Text>
            </View>
        )
    }

    const toggleBottomSheet = () => {
        bs.current.snapTo(0)
    }

    const onSubmitUpdate = async () => {
        setLoading(true)
        let avtUrl = await handleUploadImage()
        await deleteCurrentAvatarFromStorage()
        await firestore()
            .collection('users')
            .doc(userData.uid)
            .update({
                about: userData.about,
                phone: userData.phone,
                age: userData.age,
                avt: avtUrl
            })
            .then(() => setLoading(false))
            .then(() => Alert.alert('Profile updated', '', [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("Profile")
                }
            ]))
            .catch(e => console.log('err in updating userData', e))
    }

    return (
        <View style={styles.container}>
            <BottomSheet
                ref={bs}
                snapPoints={[320, 0]}
                initialSnap={1}
                callbackNode={fall}
                renderContent={renderContent}
                renderHeader={renderHeader}
                enabledGestureInteraction
            />
            <Animated.ScrollView
                style={{
                    paddingHorizontal: 20,
                    opacity: Animated.add(0.3, Animated.multiply(fall, 1))
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        // activeOpacity={0.8}
                        onPress={toggleBottomSheet}
                    >
                        <CustomAvatar size={120} displayName={userData.displayName}
                            uri={avtImg} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
                        {user.displayName}
                    </Text>
                </View>
                <View>
                    <View>

                        <TextInput style={styles.textInput} label="About"
                            theme={{
                                colors: {
                                    text: "black",
                                    primary: "#3c5898"
                                }
                            }}
                            value={userData.about} onChangeText={val => setUserData({ ...userData, about: val })}
                        />

                        <TextInput
                            style={[styles.textInput]} label="Age"
                            theme={{
                                colors: {
                                    text: "black",
                                    primary: "#3c5898"
                                }
                            }}
                            keyboardType="number-pad"
                            value={userData.age} onChangeText={val => setUserData({ ...userData, age: val })}
                        />

                        <TextInput style={styles.textInput} label="Phone"
                            keyboardType="number-pad"
                            theme={{
                                colors: {
                                    text: "black",
                                    primary: "#3c5898"
                                }
                            }}
                            value={userData.phoneNumber} onChangeText={val => setUserData({ ...userData, phoneNumber: val })}
                        />

                        <TextInput style={styles.textInput} label="Email"
                            theme={{
                                colors: {
                                    text: "black",
                                    primary: "#3c5898"
                                }
                            }}
                            disabled
                            value={userData.email}
                        />

                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.button, { backgroundColor: "#3c5898" }]}
                        onPress={onSubmitUpdate}
                        disabled={loading}
                    >
                        {
                            !loading ?
                                <Text style={{ color: 'white' }}>
                                    Update
                                </Text> :
                                <View style={{flexDirection: "row", alignItems: 'center'}}>
                                    <Text style={{ color: 'white', marginRight: 5 }}>
                                        Updating ...
                                    </Text>
                                    <ActivityIndicator size="small" color="white" />
                                </View>
                        }
                    </TouchableOpacity>
                </View>
            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    textInput: {
        backgroundColor: "transparent",
        marginVertical: 0,
        marginVertical: 10

    },
    button: {
        alignItems: "center",
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
    bsContent: {
        backgroundColor: "white",
        padding: 20,
    }
})