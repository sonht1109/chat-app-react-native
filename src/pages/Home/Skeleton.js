import React from "react";
import { ScrollView, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function Skeleton() {

    const renderSkeletonItem = () => {
        return (
            <SkeletonPlaceholder>
                <View style={{marginVertical: 10}}>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 40 }} />
                        <View style={{ marginLeft: 10 }}>
                            <View style={{ width: 100, height: 15 }} />
                            <View style={{ width: 60, height: 12, marginTop: 5 }} />
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 250, marginTop: 10 }} />
                </View>
                <View style={{marginVertical: 10}}>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 40 }} />
                        <View style={{ marginLeft: 10 }}>
                            <View style={{ width: 85, height: 15 }} />
                            <View style={{ width: 70, height: 12, marginTop: 5 }} />
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 200, marginTop: 10 }} />
                </View>
            </SkeletonPlaceholder>
        )
    }

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            {renderSkeletonItem()}
        </ScrollView>
    );
};