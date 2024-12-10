import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, Pressable, Image, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import RichTextEditor from '../components/RichTextEditor';
import { theme } from '../constants/theme';

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

  const handlePost = () => {
    console.log('Post submitted with images:', images, 'location:', location);
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

           

            {/* Location Input with Heading and Icon */}
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

            {/* Submit Button */}
            <Pressable style={styles.submitButton} onPress={handlePost}>
              <Text style={styles.submitButtonText}>Submit</Text>
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
  },
  imageWrapper: {
    marginHorizontal: 5,  
  },
  imagePreview: {
    width: 130,  // Adjusted size for a slightly smaller image
    height: 130,  // Matching height to width for a square aspect ratio
    borderRadius: 10,
    resizeMode: 'cover', // Ensure images maintain aspect ratio and fill the view
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
