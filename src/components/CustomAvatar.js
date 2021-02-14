import React, { useEffect, useState } from 'react'
import {Avatar} from 'react-native-paper'

export default function CustomAvatar({displayName, uri, size}) {

    const [label, setLabel] = useState('')

    useEffect(() => {
        if(displayName){
            setLabel(displayName.split(" ").reduce((prevString, item) => {
                return prevString + item[0]
            }, ''))
        }
    }, [])

    if(uri){
        return (
            <Avatar.Image size={size} source={require('../../assets/img/users/avt-1.png')}/> 
        )
    }
    return (
        <Avatar.Text size={size} label={label} color="white" style={{backgroundColor: "#3c5898"}} /> 
    )
}