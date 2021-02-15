import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native'
import { AuthContext } from '../../navigations/AuthProvider';
import CustomAvatar from '../../components/CustomAvatar';
import firestore from '@react-native-firebase/firestore';
import * as S from '../../styles/HomeStyled'
import Skeleton from '../Home/Skeleton';
import ScaledImage from '../../components/ScaledImage';
import storage from '@react-native-firebase/storage';
import timeConvertFromNow from '../../timeConvertFromNow';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window')

export default function Profile({ route, navigation }) {

  const { user, logout } = useContext(AuthContext)

  const [userData, setUserData] = useState({ ...user })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [onRefresh, setOnRefresh] = useState(false)

  const fetchPosts = async () => {
    let arr = []
    await firestore()
      .collection('posts')
      .where('userId', '==', route.params ? route.params.userId : userData.uid)
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
    if (route.params && route.params.userId) {
      fetchUser(route.params.userId)
    }
  }, [route.params])

  useEffect(() => {
    fetchPosts()
    navigation.addListener("focus", () => {
      console.log('navigation listener');
      setOnRefresh(prev => !prev)
    })
  }, [onRefresh, route.params])

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
    }).start(() => setOnRefresh(prev => !prev))
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
            <View style={{ marginLeft: 15 }}>
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
                transform: [{
                  scale: iconAnimated.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.5, 1]
                  })
                }]
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

  const fetchUser = async (uid) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => setUserData(doc.data()))
  }

  const renderButtons = () => {
    if (userData.uid !== user.uid) {
      return (
        <View style={styles.groupButton}>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.button}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.button}>Message</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.groupButton}>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.button}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.button} onPress={logout}>Log out</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={{ marginVertical: 40 }}>
          {/* avatar */}
          <View style={{ alignItems: 'center' }}>
            <CustomAvatar size={120} displayName={userData.displayName} uri={userData.avt} />
            <Text style={styles.displayName}>{userData.displayName}</Text>
            {
              userData.about !== '' && <Text style={styles.about}>{userData.about}</Text>
            }
            {renderButtons()}
          </View>
          {/* some detail */}
          <View style={styles.detailWrapper}>
            {/* <View style={styles.detail}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>
                {getPostsNumber()}
              </Text>
              <Text style={{color: "#666"}}>Posts</Text>
            </View> */}
            <View style={styles.detail}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
                {userData.followings.length}
              </Text>
              <Text style={{ color: "#666" }}>Followers</Text>
            </View>
            <View style={styles.detail}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
                {userData.followers.length}
              </Text>
              <Text style={{ color: "#666" }}>Followings</Text>
            </View>
          </View>
        </View>
        {/* posts */}
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
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  groupButton: {
    flexDirection: 'row',
    justifyContent: "space-around",
    marginVertical: 20
  },
  button: {
    borderColor: "#3c5898",
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: '#3c5898',
    borderRadius: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    // fontWeight: 'bold'
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10
  },
  about: {
    fontSize: 16,
    color: "#666"
  },
  detailWrapper: {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginVertical: 10
  },
  detail: {
    alignItems: 'center'
  }
})