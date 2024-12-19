import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { wp } from '../helpers/common';
import { theme } from '../constants/theme';

const AllPost = ({ posts }) => {
  console.log('Received posts:', posts);  // Debugging to check the posts data

  const renderItem = ({ item }) => {
    // Check if images exist and log them
    console.log('Post Images:', item.images);

    if (!item.images || item.images.length === 0) {
      return <Text>No images available</Text>;
    }

    return (
      <TouchableOpacity style={styles.imageContainer}>
        <Image
          source={{ uri: item.images[0] }} 
          style={styles.image}
          onError={(e) => console.log('Image load error:', e)}  
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <Text style={styles.noPostsText}>No posts available</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3} 
          renderItem={renderItem}
          contentContainerStyle={styles.gridContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  noPostsText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.Colors.text,
    marginTop: 20,
  },
  gridContainer: {
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,  // Maintain square aspect ratio
    borderRadius: 8,  // Optional, for rounded corners
    overflow: 'hidden',
  },
  image: {
    width: wp(30),  // Make the image smaller (30% of screen width)
    height: wp(30),  // Make the image smaller (30% of screen width)
    resizeMode: 'cover',  // Ensure the image covers the entire box
  },
});

export default AllPost;
