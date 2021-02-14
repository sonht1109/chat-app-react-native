import React, { useLayoutEffect, useState } from 'react'
import { ActivityIndicator, Image, Animated } from 'react-native'

export default function ScaledImage(props) {

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [loading, setLoading] = useState(true)

    const animated = new Animated.Value(0)

    useLayoutEffect(() => {
        Image.getSize(props.uri, (w, h) => {
            if(props.width && !props.height){
                setWidth(props.width)
                setHeight(h * (props.width / w))
            }
            else if(!props.width && props.height){
                setWidth(w * (props.height / h))
                setHeight(props.height)
            }
            else{
                setWidth(props.width)
                setHeight(props.height)
            }
            setLoading(false)
        }, e => console.log('scaledimage', e))
    }, [])

    const onLoadingImage = () => {
        Animated.timing(animated, {
            duration: 200,
            toValue: 1,
            useNativeDriver: true,
        }).start()
    }

    if(height) {
        return(
            <Animated.Image
            source={{uri: props.uri}}
            onLoad={onLoadingImage}
            style={{height: height, width: width, opacity: animated}}
            />
        )
    }
    else if(loading){
        return(
            <ActivityIndicator color="#3c5898" size="large" />
        )
    }
    return null
}