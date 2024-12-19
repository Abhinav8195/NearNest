import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, FlatList, Image, Alert, TextInput } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebase';

const db = getFirestore();

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== currentUser.uid) {
            usersList.push({ ...data, uid: doc.id });
          }
        });
        setUsers(usersList);
        setFilteredUsers([]); // Initially, no users should be shown
      } catch (error) {
        console.error('Error fetching users: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Handle search by both username and name
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredUsers([]); // If search term is empty, show no users
    } else {
      const filtered = users.filter(user => {
        const username = user.username || ''; // Default to empty string if username is undefined
        const name = user.name || ''; // Default to empty string if name is undefined
        return (
          username.toLowerCase().includes(term.toLowerCase()) || // Search by username
          name.toLowerCase().includes(term.toLowerCase()) // Search by name
        );
      });
      setFilteredUsers(filtered);
    }
  };

  const fetchCurrentUserDetails = async () => {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : {};
  };

  const addFriend = async (friendUid, friendName, friendProfilePicture, friendusername) => {
    if (!currentUser) return;

    const validFriendName = friendName || 'Unnamed Friend';
    const validFriendProfilePicture = friendProfilePicture || 'https://via.placeholder.com/150';

    try {
      const currentUserDetails = await fetchCurrentUserDetails();
      const currentUserDisplayName = currentUserDetails.name || 'Unnamed User';
      const currentUserProfilePicture = currentUserDetails.profilePicture || 'https://via.placeholder.com/150';
      const currentUserusername = currentUserDetails.username || 'Unnamed User';

      const currentUserDoc = doc(db, 'users', currentUser.uid);
      const friendDoc = doc(db, 'users', friendUid);

      const currentUserUpdate = {
        friends: arrayUnion({
          uid: friendUid,
          name: validFriendName,
          profilePicture: validFriendProfilePicture,
          username: friendusername,
        }),
      };
      await updateDoc(currentUserDoc, currentUserUpdate);

      const friendUpdate = {
        friends: arrayUnion({
          uid: currentUser.uid,
          name: currentUserDisplayName,
          profilePicture: currentUserProfilePicture,
          status: 'pending',
          username: currentUserusername,
        }),
      };
      await updateDoc(friendDoc, friendUpdate);

      Alert.alert('Success', 'Friendship request sent!');
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Something went wrong, please try again later.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Find Friends</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by username or name..."
          value={searchTerm}
          onChangeText={handleSearch}
        />

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <Image
                  source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }}
                  style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.username}</Text>
                  <Text style={styles.status}>{item.name}</Text>
                </View>
                <Pressable
                  onPress={() => addFriend(item.uid, item.name, item.profilePicture, item.username)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Make Friend</Text>
                </Pressable>
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
  status: {
    color: '#888',
  },
  searchInput: {
    height: 40,
    borderColor: '#eaeaea',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
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
