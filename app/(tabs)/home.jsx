import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, ScrollView, Image, FlatList } from 'react-native';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { db, auth } from '../../config/firebase';  
import { collection, getDocs } from 'firebase/firestore';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';

const Home = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchPosts = async () => {
      if (!auth.currentUser) return;
      
      try {
        const postsCollectionRef = collection(db, 'posts', auth.currentUser.uid, 'userPosts');
        const querySnapshot = await getDocs(postsCollectionRef);
        
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data() 
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImagesUris = result.assets.map(asset => asset.uri);
      setSelectedImages([...selectedImages, ...selectedImagesUris]);
      router.push({
        pathname: 'SelectItem',
        params: { images: selectedImagesUris.join(',') },
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>NearNest</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('notification')}>
              <AntDesign name="hearto" size={hp(3.2)} strokeWidth={2} color={theme.Colors.text} />
            </Pressable>
            <Pressable onPress={openImagePicker}>
              <FontAwesome name="plus-square-o" size={hp(3.2)} strokeWidth={2} color={theme.Colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('chat/chatScreen')}>
              <Ionicons name="paper-plane-outline" size={hp(3.2)} strokeWidth={2} color={theme.Colors.text} />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={auth.currentUser} router={router} />
          )}
          ListFooterComponent={(
        
              <View style={{marginVertical:posts.length===0?200:30}}>
                <Loading />
              </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.Colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: wp(40),
    height: wp(40),
    margin: 5,
  },
  nextButton: {
    backgroundColor: theme.Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
  listStyle:{
    paddingTop:20,
    paddingHorizontal:wp(4)
  }
});
