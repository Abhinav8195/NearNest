import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch, ActivityIndicator, FlatList, Image, Pressable, Alert } from 'react-native';
import * as Location from 'expo-location';
import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion, getDoc, onSnapshot } from 'firebase/firestore';
import { auth } from '@/config/firebase';

const db = getFirestore();

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance; // Distance in meters
};

const Map = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState(null); // Location state to track user's location
  const currentUser = auth.currentUser;
  let locationSubscription;

  useEffect(() => {
    if (isSearching) {
      startSearching();
    } else {
      stopSearching();
    }

    return () => {
      stopSearching(); // Clean up when the component is unmounted or when toggling off
    };
  }, [isSearching]);

  const startSearching = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    // If location is null, ask the user for permission and get location again
    if (!location) {
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
        },
        async (location) => {
          const { latitude, longitude } = location.coords;
          setLocation(location); // Update location state
          await updateUserLocation(latitude, longitude);
          fetchAllUserLocations(latitude, longitude);
        }
      );
    }

    // Setup a real-time listener for other users' locations
    onSnapshot(collection(db, "users"), (querySnapshot) => {
      const usersList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== currentUser.uid && data.latitude && data.longitude) {
          usersList.push({ ...data, uid: doc.id });
        }
      });
      setUsers(usersList);
      setLoading(false);
    });
  };

  const fetchAllUserLocations = async (latitude, longitude) => {
    // Fetch users from Firestore
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const nearbyUsers = [];
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (doc.id !== currentUser.uid && data.latitude && data.longitude) {
        // Calculate the distance from the current user to this user
        const distance = haversineDistance(
          { latitude, longitude },
          { latitude: data.latitude, longitude: data.longitude }
        );
  
        // If the distance is less than or equal to 500 meters, add to nearby users
        if (distance <= 500) {
          nearbyUsers.push({ ...data, uid: doc.id });
        }
      }
    });
  
    // Update the state with nearby users
    setUsers(nearbyUsers);
    setLoading(false);
  };
  

  const stopSearching = async () => {
    if (locationSubscription) {
      locationSubscription.remove(); // Unsubscribe from location updates
    }
    setLocation(null); // Reset location state to null when searching is stopped
    setUsers([]); // Clear user list
    setLoading(false); // Hide loader
    if (currentUser) {
      await updateUserLocation(null, null); // Set current user's coordinates to null in Firebase
    }
  };

  const updateUserLocation = async (latitude, longitude) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        latitude: latitude,
        longitude: longitude,
      });
    } catch (error) {
      console.error("Error updating user location: ", error);
    }
  };

  const addFriend = async (friendUid, friendName, friendProfilePicture) => {
    if (!currentUser) return;

    const validFriendName = friendName || "Unnamed Friend";
    const validFriendProfilePicture = friendProfilePicture || 'https://via.placeholder.com/150';

    try {
      const currentUserDetails = await fetchCurrentUserDetails();
      const currentUserDisplayName = currentUserDetails.name || "Unnamed User";
      const currentUserProfilePicture = currentUserDetails.photoURL || 'https://via.placeholder.com/150';

      const currentUserDoc = doc(db, "users", currentUser.uid);
      const friendDoc = doc(db, "users", friendUid);

      const currentUserUpdate = {
        friends: arrayUnion({
          uid: friendUid,
          name: validFriendName,
          profilePicture: validFriendProfilePicture,
        }),
      };
      await updateDoc(currentUserDoc, currentUserUpdate);

      const friendUpdate = {
        friends: arrayUnion({
          uid: currentUser.uid,
          name: currentUserDisplayName,
          profilePicture: currentUserProfilePicture,
          status: "pending",
        }),
      };
      await updateDoc(friendDoc, friendUpdate);

      Alert.alert("Success", "Friendship request sent!");
    } catch (error) {
      console.error("Error adding friend:", error);
      Alert.alert("Error", "Something went wrong, please try again later.");
    }
  };

  const fetchCurrentUserDetails = async () => {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : {};
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Find Friends</Text>

        <Switch
          value={isSearching}
          onValueChange={(value) => setIsSearching(value)}
        />

        {!isSearching ? (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>Turn on location to see nearby friends!</Text>
          </View>
        ) : loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
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
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
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
  loaderContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
});

export default Map;
