import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Alert, FlatList, View} from 'react-native'
import * as S from '../../styles/HomeStyled'
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../navigations/AuthProvider';
import storage from '@react-native-firebase/storage';
import Skeleton from './Skeleton';
import Post from '../../components/Post';
import Icon from 'react-native-vector-icons/Ionicons'

export default function Home({ navigation }) {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [onRefresh, setOnRefresh] = useState(false)
    const { user } = useContext(AuthContext)
    const flatlistRef = useRef(null)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () =>  <Icon name="planet-outline" color="#3c5898" size={40} onPress={onFlatlistRefresh} /> 
        })
    }, [])
    
    const onFlatlistRefresh = () => {
        flatlistRef.current.scrollToOffset({
            offset: 0,
            animated: true
        })
        setOnRefresh(prev => !prev)
    }

    const fetchPosts = async () => {
        let arr = []
        await firestore()
            .collection('posts')
            .orderBy('date', 'desc')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { date, userId, post, postImg, likes, comments, userAvt, userDisplayName } = doc.data()
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
                if (loading) setLoading(false)
            })
            .catch(e => console.log('Err in fetching posts', e))
    }

    useEffect(() => {
        fetchPosts()
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

    const renderItem = ({ item }) => {
        return <Post
        item={item}
        onDeletePost={onDeletePost}
        user={user}
        navigation={navigation}
        />
    }

    return (
        <S.Container bgColor="#fff">
            {
                !loading ?
                    <FlatList
                        ref={flatlistRef}
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