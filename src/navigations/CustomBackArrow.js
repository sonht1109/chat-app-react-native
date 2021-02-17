import Icon from 'react-native-vector-icons/Ionicons'
import React from 'react'

export default function CustomBackArrow({navigation}){
    return(
        <Icon name="chevron-back" color="#3c5898" size={25} style={{marginLeft: 20}}
        onPress={()=>navigation.goBack()} />
    )
}