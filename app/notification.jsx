import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, Pressable, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { auth } from '@/config/firebase';
import { useChatContext } from '../context/ChatContext'; // Ensure you have this import

const db = getFirestore();

const Notification = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const { startDMChatRoom } = useChatContext(); // Hook to start DM chat room

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const pendingRequests = userData.friends
            ? userData.friends.filter(friend => friend.status === 'pending')
            : [];
          setPendingRequests(pendingRequests);
        }
      } catch (error) {
        console.error("Error fetching pending requests: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [currentUser]);

  const acceptFriendRequest = async (friend) => {
    if (!currentUser) return;

    try {
      const currentUserDocRef = doc(db, "users", currentUser.uid);
      const friendDocRef = doc(db, "users", friend.uid);

      // Remove the pending friend request from the current user's friends array
      await updateDoc(currentUserDocRef, {
        friends: arrayRemove(friend),
      });

      // Add the accepted friend to the current user's friends array with status 'accepted'
      await updateDoc(currentUserDocRef, {
        friends: arrayUnion({ ...friend, status: 'accepted' }),
      });

      // Update the friend's document to reflect the acceptance
      const friendDoc = await getDoc(friendDocRef);
      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        const updatedFriends = friendData.friends.map(f => 
          f.uid === currentUser.uid ? { ...f, status: 'accepted' } : f
        );

        await updateDoc(friendDocRef, {
          friends: updatedFriends,
        });
      }

      // Update the pending requests state
      setPendingRequests(prev => prev.filter(req => req.uid !== friend.uid));

      // Start a DM chat room with the accepted friend
      startDMChatRoom(friend);

      Alert.alert("Success", "Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request: ", error);
      Alert.alert("Error", "Something went wrong, please try again later.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Pending Friend Requests</Text>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <View style={styles.requestContainer}>
                <Image
                  source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }}
                  style={styles.profileImage}
                />
                <View style={styles.requestInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.status}>Status: {item.status}</Text>
                  <Pressable
                    onPress={() => acceptFriendRequest(item)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  requestInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Notification;
