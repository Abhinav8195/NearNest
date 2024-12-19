import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, Pressable, Image, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import RichTextEditor from '../components/RichTextEditor';
import { theme } from '../constants/theme';
import { storage, db } from '../config/firebase'; // Assuming firebase configuration is in this file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../config/firebase'; 

const Post = () => {
  const { selectedImages } = useLocalSearchParams(); 
  const [images, setImages] = useState(selectedImages ? selectedImages.split(',') : []); 
  const [location, setLocation] = useState('');
  const router = useRouter();
  const bodyref = useRef('');
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Selected images:', selectedImages);
    console.log('Parsed images:', images);
  }, [selectedImages, images]);

  const handlePost = async () => {
    setLoading(true);
    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const response = await fetch(image);
          const blob = await response.blob();
          const filename = `posts/${auth.currentUser.uid}/${new Date().getTime()}`;
          const storageRef = ref(storage, filename);
          await uploadBytes(storageRef, blob);
          return await getDownloadURL(storageRef);
        })
      );
  
      // Create unique post ID for each post (based on timestamp or other unique value)
      const postId = new Date().getTime().toString();  // Use timestamp for unique ID
      const postRef = doc(db, 'posts', auth.currentUser.uid, 'userPosts', postId);
      
      // Store the post
      await setDoc(postRef, {
        userId: auth.currentUser.uid,
        body: bodyref.current,
        images: imageUrls, // Array of image URLs
        location,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      // Store the postId in the user's document for easy reference when they want to delete it
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        posts: { [postId]: postId }, // Store postId in a field (to delete it later)
      }, { merge: true });
  
      console.log('Post successfully submitted');
      router.push('/home');  // Navigate to feed or home page after post is created
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.header}>
              <Pressable onPress={handleBack} style={styles.iconWrapper}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </Pressable>
              <Text style={styles.headerTitle}>New Post</Text>
              <View style={styles.emptySpace} />
            </View>

             {/* Location Input with Heading and Icon */}
             <View style={{marginBottom:20}}>
                <View style={styles.locationContainer}>
                  <MaterialIcons name="location-on" size={24} color="black" />
                  <Text style={styles.locationLabel}>Add Location</Text>
                </View>
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter location"
                  value={location}
                  onChangeText={setLocation}
            />
             </View>

            <RichTextEditor editorRef={editorRef} onChange={body => (bodyref.current = body)} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScrollContainer}
            >
              {images.length > 0 ? (
                images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                  </View>
                ))
              ) : (
                <Text>No images selected</Text>
              )}
            </ScrollView>
              
           

            {/* Submit Button */}
            <Pressable style={styles.submitButton} onPress={handlePost} disabled={loading}>
              <Text style={styles.submitButtonText}>
                {loading ? 'Submitting...' : 'Submit'}
              </Text>
            </Pressable>
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
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  iconWrapper: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  emptySpace: {
    width: 40,
  },
  imageScrollContainer: {
    paddingVertical: 10,
    // backgroundColor:'pink',
    height:200
  },
  imageWrapper: {
    marginHorizontal: 5,  
  },
  imagePreview: {
    width: 130,
    height: 130,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  locationInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: theme.Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Post;
