import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { ChannelList } from 'stream-chat-expo';
import { router, useNavigation } from 'expo-router';
import { auth } from '../../config/firebase';
import { theme } from '../../constants/theme';

const ChatScreen = () => {
  const { chatClient, setCurrentChannel } = useChatContext();
  const [userChannels, setUserChannels] = useState([]);
  const user = auth.currentUser; 
  const navigation = useNavigation();
  useEffect(()=>{
    navigation.setOptions({
      headerShown: true,
      headerBackTitleVisible: '',
      title:  'Username',
    });
  },[])

  useEffect(() => {
    const fetchUserChannels = async () => {
      if (chatClient && user) {
        try {
          console.log("Fetching channels for user:", user.uid);

        
          const channelsResponse = await chatClient.queryChannels({
            members: { $in: [user.uid] },
          });
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
    return <ActivityIndicator size={'large'} color={theme.Colors.primary} style={{flex:1,alignItems:'center',justifyContent:'center'}}/>
  }
const filters = {type:'messaging',members:{ $in :[user.uid]}}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChannelList
        channels={userChannels}
        onSelect={onSelect} 
        filters={filters}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
