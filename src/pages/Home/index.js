import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import * as S from '../../styles/HomeStyled'
import posts from '../../posts'
import Icon from 'react-native-vector-icons/Ionicons'

export default function Home() {

    const renderItem = ({ item }) => {
        return (
            <S.PostWrapper>
                <S.Post>
                    <View style={{ flexDirection: 'row' }}>
                        <S.Avatar source={item.avt} />
                        <View>
                            <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
                            <Text style={{ fontSize: 12, color: "#666" }}>{item.date}</Text>
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
                    <S.PostImage source={item.postImg} />
                }
                <S.PostInteract>
                    <TouchableOpacity>
                        <View style={{flexDirection: "row", marginRight: 40}}>
                            <Icon name={item.liked ? "heart" : "heart-outline"} size={20} color="#3c5898" />
                            <S.InteractText>{item.likes}</S.InteractText>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{flexDirection: "row"}}>
                            <Icon name="chatbox-outline" size={20} color="#3c5898" />
                            <S.InteractText>{item.comments}</S.InteractText>
                        </View>
                    </TouchableOpacity>
                </S.PostInteract>
            </S.PostWrapper>
        )
    }

    return (
        <S.Container bgColor="#fff">
            <FlatList
                data={posts}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{paddingHorizontal: 20}}
            />
        </S.Container>
    )
}