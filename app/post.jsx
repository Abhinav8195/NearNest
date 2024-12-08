import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, Pressable, Image, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';  // Importing AntDesign for the back icon

const Post = () => {
  const { selectedImages } = useLocalSearchParams(); // Get selected images from the query params
  const [images, setImages] = useState(selectedImages ? selectedImages.split(',') : []); // Split string to array if needed
  const router = useRouter();

  // Debugging step: log the selectedImages and images
  useEffect(() => {
    console.log('Selected images:', selectedImages);
    console.log('Parsed images:', images);
  }, [selectedImages, images]);

  const handlePost = () => {
    // Handle post submission (send images, caption, etc.)
    console.log('Post submitted with images:', images);
  };

  // Go back to the previous page when back icon is pressed
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header with back icon */}
        <View style={styles.headerContainer}>
          <Pressable onPress={handleBack} style={styles.backIcon}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
          <Text style={styles.header}>New Post</Text>
        </View>

        {/* Image Preview Container */}
        <View style={styles.imagePreviewContainer}>
          {images.length > 0 ? (
            images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.imagePreview}
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
              />
            ))
          ) : (
            <Text>No images selected</Text>
          )}
        </View>

        {/* Submit Button */}
        <Pressable style={styles.submitButton} onPress={handlePost}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    alignItems: 'center', // Center align the images
  },
  imagePreview: {
    width: 300,
    height: 200,
    marginBottom: 10,
    resizeMode: 'contain', // Ensure the images are contained within the view
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Post;
