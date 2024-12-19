import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator, Linking, ScrollView } from 'react-native';
import { auth, db } from '../../config/firebase';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { doc, onSnapshot } from 'firebase/firestore';  
import AllPost from '../../components/AllPost';
import { fetchPosts } from '../../services/postService';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [postsCount, setPostsCount] = useState(0);  
  const user = auth.currentUser;
  const router = useRouter();

 
  const postsFetched = useRef(false);

  useEffect(() => {
    const loadPosts = async () => {
      if (!postsFetched.current) {  
        try {
          const fetchedPosts = await fetchPosts();
          setPosts(fetchedPosts);
          postsFetched.current = true; 
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    loadPosts();
  }, []); 

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsubscribeSnapshot = onSnapshot(userRef, (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setPostsCount(Number(data.posts) || 0);  
        }
      });
      setLoading(false);
      return () => unsubscribeSnapshot();
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await auth.signOut();
              router.replace('/auth/sign-in');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Logout Failed', 'There was an error logging out. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLinkPress = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex); 

    if (match && match[0]) {
      Linking.openURL(match[0]).catch((err) => console.error('Failed to open link:', err));
    } else {
      Alert.alert('Invalid Link', 'No valid URL found in the text.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.profileHeader} showsVerticalScrollIndicator={false}>
        {/* Header with Username and Logout Button */}
        <View style={styles.headerRow}>
          <Text style={styles.username}>{userData?.username}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons name="logout" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Profile Info with Image and Stats */}
        <View style={styles.profileInfoContainer}>
          <Image
            source={userData?.profilePicture ? { uri: userData.profilePicture } : require('../../assets/images/defaultUser.png')}
            style={styles.profileImage}
          />

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>posts</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userData?.followersCount}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
        </View>

        {/* User's Email */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>{userData?.name}</Text>
        </View>

        <View style={styles.profileContainer}>
          <Text style={styles.emailText}>{userData?.bio}</Text>
        </View>

        {/* Make the link clickable */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => handleLinkPress(userData?.link)}>
            <Text style={styles.linkText}>🔗 {userData?.link}</Text>
          </TouchableOpacity>
        </View>

        {/* Edit and Share Profile Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/editProfile')}>
            <Text style={styles.text}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        <AllPost posts={posts} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    marginHorizontal: wp(4),
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    color: theme.Colors.text,
    fontSize: 25,
    fontWeight: theme.fonts.bold,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: theme.Colors.darkLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: wp(10),
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: theme.Colors.text,
  },
  emailContainer: {
    marginTop: 10,
  },
  profileContainer: {
    marginTop: 2,
  },
  emailText: {
    fontSize: 14,
    color: theme.Colors.textDark,
    fontWeight: '500',
  },
  linkText: {
    fontSize: 14,
    color: theme.Colors.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.Colors.darkLight,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    marginHorizontal: 5,
  },
  text: {
    fontWeight: theme.fonts.bold,
  },
});
