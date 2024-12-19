import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, View, Image, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../constants/theme';
import { wp } from '../helpers/common';
import ImageViewing from 'react-native-image-viewing';
import { AntDesign } from '@expo/vector-icons';

const SelectItem = () => {
  const router = useRouter();
  const { images } = useLocalSearchParams();
  const [selectedImages, setSelectedImages] = useState(images ? images.split(',') : []);
  const [imageDimensions, setImageDimensions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    router.push({
      pathname: 'post',
      params: { selectedImages },
    });

  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  useEffect(() => {
    if (selectedImages.length === 0) {
      router.back();
    }
  }, [selectedImages]);


  useEffect(() => {
    const fetchImageDimensions = () => {
      const dimensions = [];
      selectedImages.forEach((item, index) => {
        Image.getSize(item, (width, height) => {
          dimensions[index] = { width, height };
          setImageDimensions([...dimensions]); 
        });
      });
    };
    
    if (selectedImages.length > 0) {
      fetchImageDimensions();
    }
  }, [selectedImages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconWrapper}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={styles.emptySpace} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollContainer}
        >
          {selectedImages.map((item, index) => (
            <View style={styles.imageWrapper} key={index}>
              <Pressable
                onPress={() => {
                  setCurrentIndex(index);
                  setIsVisible(true);
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: wp(80), 
                    height: imageDimensions[index]
                      ? (imageDimensions[index].height / imageDimensions[index].width) * wp(80) 
                      : wp(80),
                    resizeMode: 'contain', 
                  }}
                />
              </Pressable>
              <Pressable style={styles.deleteIcon} onPress={() => handleRemoveImage(index)}>
                <AntDesign name="closecircle" size={24} color="red" />
              </Pressable>
            </View>
          ))}
        </ScrollView>

        <ImageViewing
          images={selectedImages.map((uri) => ({ uri }))}
          imageIndex={currentIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        />

        {selectedImages.length > 0 && (
          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectItem;

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
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginHorizontal: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  nextButton: {
    backgroundColor: theme.Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
