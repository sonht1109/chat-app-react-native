import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Alert, Animated, Easing, FlatList, LogBox, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../../navigations/AuthProvider';
import CustomAvatar from '../../components/CustomAvatar';
import firestore from '@react-native-firebase/firestore';
import * as S from '../../styles/HomeStyled'
import Skeleton from '../Home/Skeleton';
import storage from '@react-native-firebase/storage';
import Post from '../../components/Post';
import Icon from 'react-native-vector-icons/Ionicons'

export default function Profile({ route, navigation }) {

  const { user, logout } = useContext(AuthContext)

  const [userData, setUserData] = useState({ ...user })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [onRefresh, setOnRefresh] = useState(false)

  const refreshAnimated = new Animated.Value(0)

  const isFollowed = useMemo(() => {
    let res = false
    if (route.params && route.params.userId) {
      res = userData.followers.includes(user.uid)
    }
    return res
  }, [userData])

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
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [])

  useEffect(() => {
    let uid = user.uid
    if (route.params && route.params.userId) {
      uid = route.params.userId
    }
    fetchUser(uid)
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

  const renderItem = ({ item }) => {
    return <Post item={item} onDeletePost={onDeletePost} user={user} />
  }

  const fetchUser = async (uid) => {
    await firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => setUserData(doc.data()))
      .catch(e => console.log('err in fetching user,', e))
  }

  const onFollow = async () => {
    if (route.params && route.params.userId) {
      await firestore()
        .collection('users')
        .doc(route.params.userId)
        .update({
          followers: isFollowed ? firestore.FieldValue.arrayRemove(user.uid) : firestore.FieldValue.arrayUnion(user.uid)
        })
        .then(async () => {
          await firestore()
            .collection('users')
            .doc(user.uid)
            .update({
              followings: isFollowed ? firestore.FieldValue.arrayRemove(route.params.userId) : firestore.FieldValue.arrayUnion(route.params.userId)
            })
            .then(() => setOnRefresh(prev => !prev))
            .catch(e => console.log("err in updating followings of current user", e))
        })
        .catch(e => console.log("err in updating followers of user", e))
    }
  }

  const onHandleRefresh = () => {
    refreshAnimated.setValue(0)
    Animated.timing(refreshAnimated, {
      toValue: 1,
      useNativeDriver: true,
      duration: 500,
      easing: Easing.bezier(.53,1.18,.67,.9)
    }).start(() => setOnRefresh(prev => !prev))
  }

  const renderButtons = () => {
    if (userData.uid !== user.uid) {
      return (
        <View style={styles.groupButton}>
          <TouchableOpacity activeOpacity={0.8} onPress={onFollow}>
            <Text style={isFollowed ? styles.activeButton : styles.button}>
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.button}>
              Message
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.groupButton}>
        <TouchableOpacity activeOpacity={0.8}>
          <Text
          style={styles.button}
          onPress={() => navigation.navigate("EditProfile", {userData: userData})}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.button} onPress={logout}>Log out</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const refreshStyle = refreshAnimated.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: ["0deg", "240deg", '180deg']
  })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: route.params ? "space-between" : "flex-end" }}>
         {
           route.params &&  <TouchableOpacity
           activeOpacity={0.8} onPress={() => navigation.goBack()}>
             <Icon name="chevron-back" size={25} color="black" style={{marginLeft: 20}} />
           </TouchableOpacity>
         }
          <TouchableOpacity onPress={onHandleRefresh} activeOpacity={0.8}>
            <Animated.View style={{ marginRight: 20, transform: [{
              rotate: refreshStyle
            }] }}>
              <Icon name="sync-outline" color="black" size={25} />
            </Animated.View>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 20 }}>
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
            <View style={styles.detail}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
                {posts.length}
              </Text>
              <Text style={{ color: "#666" }}>Posts</Text>
            </View>
            <View style={styles.detail}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
                {userData.followers.length}
              </Text>
              <Text style={{ color: "#666" }}>Followers</Text>
            </View>
            <View style={styles.detail}>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
                {userData.followings.length}
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
    fontSize: 14,
    marginTop: 5,
    color: "#666"
  },
  detailWrapper: {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginVertical: 10
  },
  detail: {
    alignItems: 'center'
  },
  activeButton: {
    backgroundColor: "#3c5898",
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: 'white',
    borderRadius: 5,
    marginHorizontal: 10,
    borderWidth: 0,
  }
})