import { auth } from "@/config/firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from 'stream-chat';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { OverlayProvider, Chat } from 'stream-chat-expo';
import { router } from "expo-router";

export const ChatContext = createContext({});

const db = getFirestore();

const ChatContextProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [currentChannel, setCurrentChannel] = useState();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        console.log('User signed in:', currentUser.uid);
        setUser(currentUser);
      } else {
        console.log('No user is signed in');
        setUser(null);
        setUserData(null); 
        if (chatClient) {
          chatClient.disconnectUser();
          setChatClient(null); 
        }
      }
    });

    return () => unsubscribe();
  }, [chatClient]);

  // Fetch user data when user is set
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          console.log('Fetching user data for user:', user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            console.log('User data:', userDoc.data());
            setUserData(userDoc.data());
          } else {
            console.error("No such user document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); 
        }
      } else {
        setLoading(false); 
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setUserData(null); 
      setLoading(false); 
    }
  }, [user]);

  // Initialize Stream Chat client when userData and user are set
  useEffect(() => {
    const initChat = async () => {
      if (userData && user) {
        try {
          if (chatClient) {
            console.log('Disconnecting existing chat client');
            await chatClient.disconnectUser();
            setChatClient(null);
          }

          const client = StreamChat.getInstance("md8gr4jf3um7");
          const image = userData.profilePicture || user.photoURL;

          console.log('Initializing chat for user:', user.uid);
          await client.connectUser(
            {
              id: user.uid,
              name: userData.name,
              image: image,
            },
            client.devToken(user.uid)
          );

          setChatClient(client);

          // Commenting out the livestream chat initialization code
          /*
          const globalChannel = client.channel('livestream', "global", {
            name: "join now",
          });
          await globalChannel.watch();
          */

        } catch (error) {
          console.error("Error initializing chat client:", error);
        }
      }
    };

    if (userData && user) {
      initChat();
    }
  }, [userData, user]);

  // Clean up chat client on unmount
  useEffect(() => {
    return () => {
      if (chatClient) {
        console.log('Disconnecting chat client');
        chatClient.disconnectUser();
        setChatClient(null);
      }
    };
  }, [chatClient]);

  const startDMChatRoom = async (chatWithUser) => {
    if (!chatClient || !chatWithUser?.uid || !user?.uid) {
      console.error("Error: Missing user data for DM");
      return;
    }
  
    try {
      // Use user.uid from context as the current user ID
      const [user1, user2] = [user.uid, chatWithUser.uid].sort();
      const channelID = `dm-${user1}-${user2}`;
  
      // Ensure members are passed as an array of strings (user IDs)
      const newChannel = chatClient.channel('messaging', channelID, {
        members: [user1, user2],
      });
  
      await newChannel.watch();
      setCurrentChannel(newChannel);
      router.push('/chat/chatScreen');
    } catch (error) {
      console.error("Error starting DM:", error);
    }
  };

  if (loading) {
    return null; 
  }

  const value = {
    currentChannel,
    chatClient,
    setCurrentChannel,
    startDMChatRoom
  };

  return (
    <OverlayProvider>
      {chatClient ? (
        <Chat client={chatClient}>
          <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
        </Chat>
      ) : (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
      )}
    </OverlayProvider>
  );
};

export const useChatContext = () => useContext(ChatContext);

export default ChatContextProvider;
