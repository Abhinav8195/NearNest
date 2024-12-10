import React,{createContext, useContext} from "react";
export const ChatContext = createContext({})

 const ChatContextProvider =({children})=>{
    const value ={username:"Text Abhinav"}
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
};

export const useChatContext=()=>useContext(ChatContext)

export default ChatContextProvider;