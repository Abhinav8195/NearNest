import { auth } from "@/config/firebase";
import React,{createContext, useContext,useEffect, useState} from "react";
import {StreamChat} from 'stream-chat';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const ChatContext = createContext({})
    
const db = getFirestore()

 const ChatContextProvider =({children})=>{
    const user = auth.currentUser;
    const [chatClient,setChatClient]=useState()
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log('object',user.uid)

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setUserData(userDoc.data());
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserData();
      }, []);

if(!user){
    return
}

    useEffect(()=>{
        const initChat = async()=>{
                const client = StreamChat.getInstance("md8gr4jf3um7");
                const image = userData.profilePicture || user.photoURL; 
                await client.connectUser({
                    id:user?.uid,
                    name:userData.name,
                    image:image

                },client.devToken(user?.uid));
                setChatClient(client)
        };
        initChat()
},[]);

useEffect(()=>{
    return()=>{
        if(chatClient){
            chatClient.disconnectUser();
        }
    }
},[])

    const value ={username:"Text Abhinav"}
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
};

export const useChatContext=()=>useContext(ChatContext)

export default ChatContextProvider;