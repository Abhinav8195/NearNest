import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Pressable, TextInput, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, Image } from 'react-native';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import Feather from '@expo/vector-icons/Feather';
import defaultUserImage from '../assets/images/defaultUser.png';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import { auth } from '../config/firebase';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

const EditProfile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);

  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setDataLoading(true);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || '');
          setUsername(userData.username || '');
          setBio(userData.bio || '');
          setPhoneNumber(userData.phoneNumber || '');
          setGender(userData.gender || 'Male');
          setLink(userData.link || '');
          setSelectedImage(userData.profilePicture || defaultUserImage);
        }
      } catch (error) {
        console.log('Error fetching user profile:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loadingData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.Colors.primary} />
      </SafeAreaView>
    );
  }

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const userRef = doc(db, 'users', userId);
      const imageToSave = selectedImage || defaultUserImage;

      await updateDoc(userRef, {
        name: name || '',
        username: username || '',
        bio: bio || '',
        phoneNumber: phoneNumber || '',
        gender: gender || 'Male',
        link: link || '',
        profilePicture: imageToSave,
      });

      alert('Profile updated successfully');
      router.replace('/profile')
    } catch (error) {
      console.log('Error updating profile:', error);
      alert('Error updating profile');
    }

    setLoading(false);
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  const clearLink = () => {
    setLink('');
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            {/* Left Arrow */}
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-circle-outline" size={28} color="black" />
            </TouchableOpacity>

            {/* Title Centered */}
            <Text style={styles.text}>Edit Profile</Text>

            {/* Empty View to align the title properly */}
            <View style={{ width: 24 }} />
          </View>

          <View style={{ gap: 15, marginTop: 30 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: selectedImage || defaultUserImage }}
                style={styles.profileImage}
              />
              <Pressable style={styles.editIcon} onPress={openGallery}>
                <Feather name="edit-3" size={20} color="black" />
              </Pressable>
            </View>
          </View>

          <View style={{ alignItems: 'center', gap: 10 }}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={theme.Colors.textLight}
              />
            </View>

            {/* Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor={theme.Colors.textLight}
              />
            </View>

            {/* Bio */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, { height: hp(8) }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Write something about yourself"
                placeholderTextColor={theme.Colors.textLight}
                multiline
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.Colors.textLight}
                keyboardType="phone-pad"
              />
            </View>

            {/* Gender */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <Picker
                selectedValue={gender}
                style={[styles.input, { height: Platform.OS === 'ios' ? hp(-6) : hp(7), paddingVertical: Platform.OS === 'ios' ? 5 : 0 }]}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Link */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Link (Optional)</Text>
              <View style={styles.linkInputContainer}>
                <TextInput
                  style={styles.input}
                  value={link}
                  onChangeText={setLink}
                  placeholder="Enter a link (e.g., social media or website)"
                  placeholderTextColor={theme.Colors.textLight}
                  keyboardType="url"
                />
                {link.length > 0 && (
                  <TouchableOpacity onPress={clearLink} style={styles.clearIconContainer}>
                    <Ionicons name="close-circle" size={20} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={{ width: '90%', margin: 'auto', marginTop: 20 }}>
            <Button title={'Update Profile'} loading={loading} onPress={handleUpdate} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  text: {
    color: theme.Colors.textDark,
    fontWeight: theme.fonts.semibold,
    fontSize: hp(2.1),
    textAlign: 'center',
    flex: 1,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  profileImage: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.Colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  inputContainer: {
    width: '95%',
    marginVertical: 10,
  },
  label: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.Colors.textDark,
    marginBottom: 5,
  },
  inputContainer: {
    width: '95%',
    marginVertical: 10,
  },
  linkInputContainer: {
    position: 'relative',
  },
  label: {
    fontSize: hp(1.6),
    fontWeight: '500',
    color: theme.Colors.textDark,
    marginBottom: 5,
  },
  input: {
    height: hp(6),
    width: '100%',
    borderColor: theme.Colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.xl,
    paddingHorizontal: 15,
    fontSize: hp(1.8),
    color: theme.Colors.textDark,
  },
  clearIconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;
