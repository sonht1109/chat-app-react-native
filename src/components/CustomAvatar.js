import React, { useEffect, useState } from 'react'
import {Avatar} from 'react-native-paper'

export default function CustomAvatar({displayName, uri, size}) {

    const [label, setLabel] = useState('')
    console.log(displayName);

    useEffect(() => {
        if(displayName){
            setLabel(displayName.split(" ").reduce((prevString, item) => {
                return prevString + item[0]
            }, ''))
        }
    }, [])

    if(uri){
        return (
            <Avatar.Image size={size} source={{uri: uri}}/> 
        )
    }
    return (
        <Avatar.Text size={size} label={label} color="white" style={{backgroundColor: "#3c5898"}} /> 
    )
}