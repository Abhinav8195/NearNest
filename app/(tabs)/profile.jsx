import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../../config/firebase';
import { useRouter } from 'expo-router';

export default function Profile() {

  const user = auth.currentUser
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Logout Failed', 'There was an error logging out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
       <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
       </TouchableOpacity>
    </SafeAreaView>
  )
}