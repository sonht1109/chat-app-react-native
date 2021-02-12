import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as S from '../../styles/HomeStyled'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddPost() {
    return (
        <S.AddPostContainer>
            <S.AddPostInput
                placeholder="How is it going ?"
                multiline
                color="#666"
            />
            {/* <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => { }}>
                    <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => { }}>
                    <Icon name="md-done-all" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton> */}
        </S.AddPostContainer>
    )
}

const styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
  });