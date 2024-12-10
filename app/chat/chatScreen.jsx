import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {ChatContext, useChatContext} from '../../context/ChatContext'





const ChatScreen = () => {
  const {username}=useChatContext()
  return (
   <SafeAreaView style={{flex:1}}>
     <View>
      <Text>{username}</Text>
    </View>
   </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})