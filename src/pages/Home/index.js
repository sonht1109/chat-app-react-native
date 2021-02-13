import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import * as S from '../../styles/HomeStyled'
import posts from '../../posts'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigations/AuthProvider';

export default function Home() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [onRefresh, setOnRefresh] = useState(false)
    const { user } = useContext(AuthContext)

    const fetchPosts = async () => {
        let arr = []
        await firestore()
            .collection('posts')
            .orderBy('date', 'desc')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { date, userId, avt, post, postImg, likes, comments } = doc.data()
                    arr.push({
                        id: doc.id,
                        date: date.seconds,
                        userId,
                        user: 'Hoang Thai Son',
                        avt,
                        post,
                        postImg,
                        likes,
                        comments,
                        liked: false
                    })
                })
                setPosts(arr)
            })
            .catch(e => console.log('Error in fetch posts', e))
    }

    useEffect(() => {
        fetchPosts()
    }, [onRefresh])

    const onDeletePost = (id) => {
        Alert.alert('Delete post', 'Are you sure ?', [
            {
                text: "Cancel"
            },
            {
                text: "Yes",
                onPress: async () => {
                    await firestore()
                    .collection('posts')
                    .doc(id)
                    .delete()
                    .then(() => Alert.alert('Deleted !'))
                    .then(() => setOnRefresh(prev => !prev))
                    .catch(e => console.log('Err in deleting post', e))
                }
            }
        ])
    }

    const renderItem = ({ item }) => {
        return (
            <S.PostWrapper>
                <S.Post>
                    <View style={{ flexDirection: 'row' }}>
                        <S.Avatar source={require('../../../assets/img/users/avt-1.png')} />
                        <View>
                            <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
                            <Text style={{ fontSize: 12, color: "#666" }}>
                                {item.date}
                            </Text>
                        </View>
                    </View>
                    <S.PostText>
                        <Text>
                            {item.post}
                        </Text>
                    </S.PostText>
                </S.Post>
                {
                    item.postImg &&
                    <S.PostImage source={{ uri: item.postImg }} />
                }
                <S.PostInteract>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", marginRight: 40, alignItems: 'center' }}>
                            <Icon name={item.liked ? "heart" : "heart-outline"} size={24} color="#3c5898" />
                            <S.InteractText>{item.likes}</S.InteractText>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="chatbox-outline" size={24} color="#3c5898" />
                            <S.InteractText>{item.comments}</S.InteractText>
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
            <FlatList
                // refreshing={true}
                // onRefresh={() => fetchPosts()}
                data={posts}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
        </S.Container>
    )
}