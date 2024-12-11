import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {ChatContext, useChatContext} from '../../context/ChatContext'

import {ChannelList} from 'stream-chat-expo'
import { router } from 'expo-router'



const ChatScreen = () => {
  const {setCurrentChannel}=useChatContext();
  const onSelect=(channel)=>{
    setCurrentChannel(channel)
    router.push('/chat/chatRoom')
  }
  return (
  
 <SafeAreaView style={{flex:1}}>
    <ChannelList onSelect={onSelect}/>
 </SafeAreaView>

  )
}

export default ChatScreen

const styles = StyleSheet.create({})