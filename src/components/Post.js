import React, { useMemo, useState } from 'react'
import { Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native'
import * as S from '../styles/HomeStyled'
import timeConvertFromNow from '../timeConvertFromNow';
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore';
import CustomAvatar from './CustomAvatar';
import ScaledImage from './ScaledImage';

const {width} = Dimensions.get('window')

export default function Post({item, user, onDeletePost, navigation}) {

    const iconAnimated = new Animated.Value(0)

    const [likes, setLikes] = useState(item.likes)
    
    const isLiked = useMemo(() => {
        return likes.includes(user.uid)
    }, [likes])

    const onHandleLike = async (id) => {
        iconAnimated.setValue(0)
        Animated.timing(iconAnimated, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true,
        }).start()
        await firestore()
          .doc(`posts/${id}`)
          .update({
            likes: !isLiked ? firestore.FieldValue.arrayUnion(user.uid) : firestore.FieldValue.arrayRemove(user.uid)
          })
          .then(async() => {
            await firestore()
            .doc(`posts/${id}`)
            .get()
            .then(doc => setLikes(doc.data().likes) )
          })
          .catch(e => console.log('handle like', e))
      }

    return (
        <S.PostWrapper>
            <S.Post>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <CustomAvatar size={45} displayName={item.userDisplayName} uri={item.userAvt} />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}
                            onPress={() => {
                                if(navigation){
                                    navigation.navigate("UserProfile", {
                                        userId: item.userId
                                    })
                                }
                            }}
                        >
                            {item.userDisplayName}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#666" }}>
                            {timeConvertFromNow(item.date)}
                        </Text>
                    </View>
                </View>
                {item.post !== '' &&
                    <S.PostText>
                        <Text>
                            {item.post}
                        </Text>
                    </S.PostText>}
            </S.Post>
            {
                item.postImg &&
                <ScaledImage uri={item.postImg} width={width - 40} />
            }
            <S.PostInteract>
                <TouchableOpacity
                    onPress={() => onHandleLike(item.id)}
                    activeOpacity={0.8}
                >
                    <Animated.View style={{ flexDirection: "row", marginRight: 40, alignItems: 'center' }}>
                        <Animated.View style={{
                            transform: [{
                                scale: iconAnimated.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [1, 1.5, 1]
                                })
                            }]
                        }}>
                            <Icon name={isLiked ? "heart" : "heart-outline"} size={24} color="#3c5898" />
                        </Animated.View>
                        <S.InteractText>{likes.length}</S.InteractText>
                    </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name="chatbox-outline" size={24} color="#3c5898" />
                        <S.InteractText>{item.comments.length}</S.InteractText>
                    </View>
                </TouchableOpacity>
                {
                    item.userId === user.uid &&
                    <TouchableOpacity style={{ marginLeft: 'auto' }}
                        onPress={() => onDeletePost(item.id)}>
                        <View style={{ flexDirection: "row" }}>
                            <Icon name="trash-outline" size={24} color="#3c5898" />
                        </View>
                    </TouchableOpacity>
                }
            </S.PostInteract>
        </S.PostWrapper>
    )
}