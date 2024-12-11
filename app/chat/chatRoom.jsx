import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Channel, MessageList, MessageInput } from 'stream-chat-expo';
import { useNavigation } from 'expo-router';

const ChatRoom = () => {
  const { currentChannel } = useChatContext();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitleVisible: '',
      title: currentChannel?.data?.name || 'Channel',
    });
  }, [currentChannel?.data?.name]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Channel channel={currentChannel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ChatRoom;
