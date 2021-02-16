import React from "react";
import { ScrollView, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function ProfileSkeleton() {

    const renderSkeletonItem = () => {
        return (
            <SkeletonPlaceholder>
                <View style={{alignItems: "center"}}>
                    <View style={{width: 120, height: 120, borderRadius: 120}}/>
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