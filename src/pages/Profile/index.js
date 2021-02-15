import React, { useContext, useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../../navigations/AuthProvider';
import CustomAvatar from '../../components/CustomAvatar';
import Home from '../Home';
import firestore from '@react-native-firebase/firestore';

export default function Profile({ route, navigation }) {
  const { user, logout } = useContext(AuthContext)
  // console.log(user)

  const [userData, setUserData] = useState(null)

  const fetchUserData = async() => {
    await firestore()
    .collection('users')
    .doc(route.params ? route.params.userId : user.uid)
    .get()
    .then(doc => setUserData(doc.data()))
    .catch(e => console.log('err in fetch user', e)) 
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  console.log('userdata', userData);

  const renderButtons = () => {
    if (route.params && route.params.userId === user.uid) {
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
        <View style={{marginVertical: 40}}>
          {/* avatar */}
          <View style={{ alignItems: 'center' }}>
            <CustomAvatar size={120} displayName={userData?.displayName} uri={userData?.avt} />
            <Text style={styles.displayName}>{userData?.displayName}</Text>
            {
              !user.about && <Text style={styles.about}>Love vi </Text>
            }
            {renderButtons()}
          </View>
          {/* some detail */}
          <View style={styles.detailWrapper}>
            <View style={styles.detail}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>32</Text>
              <Text style={{color: "#666"}}>Posts</Text>
            </View>
            <View style={styles.detail}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>132</Text>
              <Text style={{color: "#666"}}>Followers</Text>
            </View>
            <View style={styles.detail}>
              <Text style={{fontWeight: 'bold', fontSize: 24}}>320</Text>
              <Text style={{color: "#666"}}>Followings</Text>
            </View>
          </View>
        </View>
        {/* posts */}
        <Home navigation={navigation} profile={true} />
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