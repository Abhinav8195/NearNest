import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import React from 'react';
import { auth } from '../../config/firebase';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        {/* Header with Username and Logout Button */}
        <View style={styles.headerRow}>
          <Text style={styles.username}>abhinav_username</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons name="logout" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Profile Info with Image and Stats */}
        <View style={styles.profileInfoContainer}>
          <Image
            source={require('../../assets/images/defaultUser.png')}
            style={styles.profileImage}
          />

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>posts</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
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
          <Text style={styles.emailText}>{user?.email}</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileHeader: {
    marginHorizontal: wp(4),
    paddingBottom: 20, // Padding to space out elements from the bottom
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
  emailText: {
    fontSize: 16,
    color: theme.Colors.text,
    fontWeight: '500',
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
