import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Channel, MessageList, MessageInput } from 'stream-chat-expo';
import { useNavigation } from 'expo-router';
import { auth } from '../../config/firebase';

const ChatRoom = () => {
  const { currentChannel } = useChatContext();
  const navigation = useNavigation();
  console.log('ot',currentChannel)
   const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentChannel) {
      // Retrieve the other user's name
      const otherUser = currentChannel.state.members
        ? Object.values(currentChannel.state.members).find(
            member => member.user_id !== currentUser.uid
          )
        : null;
      navigation.setOptions({
        headerShown: true,
        headerBackTitleVisible: '',
        title: otherUser?.user?.name || 'Chat',
      });
    }
  }, [currentChannel]);

  // useEffect(() => {
  //   if (currentChannel) {
  //     navigation.setOptions({
  //       headerShown: true,
  //       headerBackTitleVisible: '',
  //       title: currentChannel?.data?.created_by?.name || 'Chat',
  //     });
  //   }
  // }, [currentChannel]); 

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
