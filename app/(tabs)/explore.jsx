import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, FlatList, Image, Alert } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebase';

const db = getFirestore();

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentUser = auth.currentUser;

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== currentUser.uid) {
            usersList.push({ ...data, uid: doc.id });
          }
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Add friend functionality
  const addFriend = async (friendUid, friendName, friendProfilePicture) => {
    if (!currentUser) return;

    try {
      // Show loading or prevent multiple presses
      console.log("Sending friend request...");

      const currentUserDoc = doc(db, "users", currentUser.uid);
      const friendDoc = doc(db, "users", friendUid);

      // Update current user’s friends array
      await updateDoc(currentUserDoc, {
        friends: arrayUnion({
          uid: friendUid,
          name: friendName,
          profilePicture: friendProfilePicture,
        }),
      });

      // Update friend’s friends array
      await updateDoc(friendDoc, {
        friends: arrayUnion({
          uid: currentUser.uid,
          name: currentUser.displayName,
          profilePicture: currentUser.photoURL,
        }),
      });

      Alert.alert("Success", "Friendship established!");
      console.log("Friendship established between", currentUser.uid, "and", friendUid);
    } catch (error) {
      console.error("Error adding friend:", error);
      Alert.alert("Error", "Something went wrong, please try again later.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Find Friends</Text>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <Image
                  source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }}
                  style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Pressable
                    onPress={() => addFriend(item.uid, item.name, item.profilePicture)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Make Friend</Text>
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
  userContainer: {
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
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

export default Explore;
