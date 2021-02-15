import React, { useContext, useEffect, useState } from 'react'
import { Alert, Dimensions, FlatList, Image, Text, TouchableOpacity, View, Animated } from 'react-native'
import * as S from '../../styles/HomeStyled'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigations/AuthProvider';
import storage from '@react-native-firebase/storage';
import Skeleton from './Skeleton';
import ScaledImage from '../../components/ScaledImage';
import timeConvertFromNow from '../../timeConvertFromNow';
import CustomAvatar from '../../components/CustomAvatar';

const { width } = Dimensions.get('window')

export default function Home({navigation, profile}) {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [onRefresh, setOnRefresh] = useState(false)
    const { user } = useContext(AuthContext)

    const fetchPosts = async () => {
        let arr = []
        if(profile){
            await firestore()
            .collection('posts')
            .where('userId', '==', user.uid)
            .orderBy('date', 'desc')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { date, userId, avt, post, postImg, likes, comments, userAvt, userDisplayName } = doc.data()
                    arr.push({
                        id: doc.id,
                        date: date.seconds,
                        userId,
                        userDisplayName,
                        userAvt,
                        post,
                        postImg,
                        likes,
                        comments,
                        liked: false
                    })
                })
            })
            .then(() => {
                setPosts(arr)
                if(loading) setLoading(false)
            })
            .catch(e => console.log('Err in fetching posts', e))
        }
        else {
            await firestore()
            .collection('posts')
            .orderBy('date', 'desc')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { date, userId, avt, post, postImg, likes, comments, userAvt, userDisplayName } = doc.data()
                    arr.push({
                        id: doc.id,
                        date: date.seconds,
                        userId,
                        userDisplayName,
                        userAvt,
                        post,
                        postImg,
                        likes,
                        comments,
                        liked: false
                    })
                })
            })
            .then(() => {
                setPosts(arr)
                if(loading) setLoading(false)
            })
            .catch(e => console.log('Err in fetching posts', e))
        }
    }

    useEffect(() => {
        fetchPosts()
        navigation.addListener("focus", () => {
            console.log('navigation listener');
            setOnRefresh(prev => !prev)
        })
    }, [onRefresh])

    const onDeletePost = (id) => {
        Alert.alert('Delete post', 'Are you sure ?', [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Yes",
                onPress: () => {
                    onDeleteImageFromFirebaseStore(id)
                }
            }
        ])
    }

    const onDeleteImageFromFirebaseStore = async (id) => {
        await firestore()
            .collection('posts')
            .doc(id)
            .get()
            .then(documentSnapshot => {
                const { postImg } = documentSnapshot.data()
                if (postImg) {
                    const storageRef = storage().refFromURL(postImg)
                    const imageRef = storage().ref(storageRef.fullPath)
                    imageRef
                        .delete()
                        .catch(e => console.log('Err in delete img', e))
                }
            })
        await onDeletePostDocument(id)
    }

    const onDeletePostDocument = async (id) => {
        await firestore()
            .collection('posts')
            .doc(id)
            .delete()
            .then(() => {
                Alert.alert('Post deleted !')
                setOnRefresh(prev => !prev)
            })
            .catch(e => console.log('Err in deleting post', e))
    }

    const onHandleLike = async (iconAnimated, id, isLiked) => {
        iconAnimated.setValue(0)
        Animated.timing(iconAnimated, {
            duration: 200,
            toValue: 1,
            useNativeDriver: true,
        }).start(() =>  setOnRefresh(prev => !prev))
        await firestore()
            .doc(`posts/${id}`)
            .update({
                likes: !isLiked ? firestore.FieldValue.arrayUnion(user.uid) : firestore.FieldValue.arrayRemove(user.uid)
            })
            .then(() => {
                
            })
            .catch(e => console.log('handle like', e))
    }

    const renderItem = ({ item }) => {
        const isLiked = item.likes.includes(user.uid)
        const iconAnimated = new Animated.Value(0)

        return (
            <S.PostWrapper>
                <S.Post>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <CustomAvatar size={45} displayName={item.userDisplayName} uri={item.userAvt} />
                        <View style={{marginLeft: 15}}>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}
                                onPress={() => navigation.navigate("UserProfile", {
                                    userId: item.userId
                                })}
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
                    onPress={() => onHandleLike(iconAnimated, item.id, isLiked)}
                    activeOpacity={0.8}
                    >
                        <Animated.View style={{ flexDirection: "row", marginRight: 40, alignItems: 'center' }}>
                            <Animated.View style={{
                                transform: [{scale: iconAnimated.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [1, 1.5, 1]
                                })}]
                            }}>
                            <Icon name={isLiked ? "heart" : "heart-outline"} size={24} color="#3c5898" />
                            </Animated.View>
                            <S.InteractText>{item.likes.length}</S.InteractText>
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

    return (
        <S.Container bgColor="#fff">
            {
                !loading ?
                    <FlatList
                        data={posts}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    /> :
                    <Skeleton />
            }
        </S.Container>
    )
}