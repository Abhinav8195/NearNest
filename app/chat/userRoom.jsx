import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useChatContext } from '../../context/ChatContext';
import { auth } from '../../config/firebase';

const db = getFirestore();

const UserRoom = () => {
  const [friends, setFriends] = useState([]);
  const { startDMChatRoom } = useChatContext();
  const [loading, setLoading] = useState(true);
const user = auth.currentUser
  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {  // Use the user from context
        try {
          console.log("Fetching friends for user:", user.uid);  // Debug log
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User data:", userData);  // Debug log
            setFriends(userData.friends || []);  // Ensure friends field exists
          } else {
            console.log("No user document found!");
            setFriends([]);  // Ensure we don't set undefined data
          }
        } catch (error) {
          console.error('Error fetching friends: ', error);
          setFriends([]);  // Handle error gracefully
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFriends();
  }, [user]);

  const handleUserSelect = (chatWithUser) => {
    console.log('Starting DM with user:', chatWithUser);
    startDMChatRoom(chatWithUser);
  };

  if (loading) {
    return <Text>Loading...</Text>;  // Show a loading message while fetching data
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.uid}  // Ensure each item has a unique 'uid'
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userName} onPress={() => handleUserSelect(item)}>
              {item.name}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserRoom;
