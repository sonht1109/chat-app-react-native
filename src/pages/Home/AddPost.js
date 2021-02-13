import React, { useLayoutEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as S from '../../styles/HomeStyled'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

export default function AddPost({ navigation }) {

    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [transferred, setTransferred] = useState(-1)

    useLayoutEffect(() => {
        const parent = navigation.dangerouslyGetParent()
        parent.setOptions({
          tabBarVisible: false
        })
        return () => {
          parent.setOptions({
            tabBarVisible: true
          })
        }
      }, [navigation])

    const onChooseFromCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            compressImageQuality: 0.8,
        }).then(image => {
            setImage(Platform === 'ios' ? image.sourceURL : image.path);
        })
            .catch(e => console.log(e))
    }

    const onChooseFromGallery = () => {
        ImagePicker.openPicker({
            cropping: true,
            compressImageQuality: 0.8,
        }).then(image => {
            setImage(Platform === 'ios' ? image.sourceURL : image.path);
        })
            .catch(e => console.log(e))
    }

    const onSubmit = async () => {
        if (image) {
            setTransferred(0)
            const fileName = image.substring(image.lastIndexOf('/') + 1)
            const extension = fileName.substring(fileName.lastIndexOf('.') + 1)
            const timeStamp = fileName.substring(0, fileName.lastIndexOf('.')) + '-' + Date.now()

            const task = storage().ref(timeStamp + '.' + extension).putFile(image)

            task.on('state_changed', taskSnapshot => {
                let bytesTransferred = taskSnapshot.bytesTransferred
                let totalBytest = taskSnapshot.totalBytes
                setTransferred(Math.round(bytesTransferred/totalBytest * 100)) 
            });

            try {
                await task
                setTransferred(-1)
                Alert.alert("Uploaded !")
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <S.AddPostContainer bgColor="#dfe6f5">
            <S.AddPostHeader>
                <Icon name="chevron-back"
                    size={25}
                    color="#3c5898"
                    onPress={() => { navigation.goBack() }}
                />
                {
                    transferred !== -1 &&
                    <S.AddPostHeaderLoading>
                        <ActivityIndicator color="#3c5989" size="small" />
                        <Text style={{marginLeft: 5, color: "#3c5989"}}>
                            {transferred} %
                        </Text>
                    </S.AddPostHeaderLoading>
                }
                <TouchableOpacity onPress={onSubmit}>
                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#3c5898" }}>Post</Text>
                </TouchableOpacity>
            </S.AddPostHeader>
            <S.AddPostInput
                placeholder="How is it going ?"
                multiline
                color="#666"
                value={text}
                onChangeText={val => setText(val)}
            />
            {
                image &&
                <Image source={{ uri: image }}
                    style={{ width: "100%", height: 300 }} />
            }
            <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="Take photo" onPress={onChooseFromCamera}>
                    <Icon name="camera-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="Choose photo" onPress={onChooseFromGallery}>
                    <Icon name="image-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </S.AddPostContainer>
    )
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});