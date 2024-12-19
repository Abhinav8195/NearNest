import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, FlatList, Image, Alert } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebase';

const db = getFirestore();

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentUser = auth.currentUser;
  console.log('explore',users)

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

  const fetchCurrentUserDetails = async () => {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : {};
  };

  const addFriend = async (friendUid, friendName, friendProfilePicture,friendusername) => {
    if (!currentUser) return;

    const validFriendName = friendName || "Unnamed Friend";
    const validFriendProfilePicture = friendProfilePicture || 'https://via.placeholder.com/150';

    try {
      const currentUserDetails = await fetchCurrentUserDetails();
      const currentUserDisplayName = currentUserDetails.name || "Unnamed User";
      const currentUserProfilePicture = currentUserDetails.profilePicture || 'https://via.placeholder.com/150';
      const currentUserusername = currentUserDetails.username || "Unnamed User";

      
      const currentUserDoc = doc(db, "users", currentUser.uid);
      const friendDoc = doc(db, "users", friendUid);

      const currentUserUpdate = {
        friends: arrayUnion({
          uid: friendUid,
          name: validFriendName,
          profilePicture: validFriendProfilePicture,
          username:friendusername
        }),
      };
      await updateDoc(currentUserDoc, currentUserUpdate);

      const friendUpdate = {
        friends: arrayUnion({
          uid: currentUser.uid,
          name: currentUserDisplayName,
          profilePicture: currentUserProfilePicture,
          status: "pending",
          username:currentUserusername
        }),
      };
      await updateDoc(friendDoc, friendUpdate);

      Alert.alert("Success", "Friendship request sent!");
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
                    onPress={() => addFriend(item.uid, item.name, item.profilePicture ,item.username)}
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
