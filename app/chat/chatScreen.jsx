import { SafeAreaView, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { ChannelList } from 'stream-chat-expo';
import { router } from 'expo-router';
import { auth } from '../../config/firebase';

const ChatScreen = () => {
  const { chatClient, setCurrentChannel } = useChatContext();
  const [userChannels, setUserChannels] = useState([]);
  const user = auth.currentUser; 

  useEffect(() => {
    const fetchUserChannels = async () => {
      if (chatClient && user) {
        try {
          console.log("Fetching channels for user:", user.uid);

        
          const channelsResponse = await chatClient.queryChannels({
            members: { $in: [user.uid] },
          });
          console.log("Fetched Channels Response:", channelsResponse);

          if (channelsResponse && channelsResponse.length > 0) {
            
            setUserChannels(channelsResponse);
          } else {
            console.log("No channels found for this user.");
            setUserChannels([]); 
          }
        } catch (error) {
          console.error("Error fetching user channels:", error);
        }
      }
    };

    if (user) {
      fetchUserChannels(); 
    }
  }, [chatClient, user]); 

  const onSelect = (channel) => {
    setCurrentChannel(channel); 
    router.push('/chat/chatRoom'); 
  };


  if (!user || userChannels.length === 0) {
    return <Text>Loading or no channels available...</Text>;
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChannelList
        channels={userChannels}
        onSelect={onSelect} 
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
