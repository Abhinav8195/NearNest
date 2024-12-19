import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';
import defaultUserImage from '../assets/images/defaultUser.png';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import moment from 'moment';
import RenderHTML from 'react-native-render-html';
import Video from 'expo-av';
import Carousel from 'react-native-reanimated-carousel'; 
import FontAwesome from '@expo/vector-icons/FontAwesome';

const textStyle = {
  color: theme.Colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.Colors.dark,
  },
  h4: {
    color: theme.Colors.dark,
  },
};

const PostCard = ({ item, router, currentUser, hasShadow = true }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item?.likes || 0);
  const [currentIndex, setCurrentIndex] = useState(0);  

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const createdAt = moment(item?.createdAt.seconds * 1000).format('MMM D'); // Format post time

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userinfo}>
          <Avatar uri={defaultUserImage} size={hp(4.5)} rounded={theme.radius.sm} style={{ borderWidth: 2 }} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{'Abhinav'}</Text>
            <Text style={styles.posttime}>{createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" size={24} color={theme.Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHTML contentWidth={wp(100)} source={{ html: item?.body }} tagsStyles={tagsStyles} />
          )}
        </View>
      </View>

      {/* Displaying images as a swipeable gallery using Carousel */}
      {item?.images?.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            width={wp(87)}  
            height={hp(40)}  
            data={item.images}  
            loop={false} 
            autoPlay={false}  
            onSnapToItem={(index) => setCurrentIndex(index)}  
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.postMedia}
                resizeMode="cover"
              />
            )}
          />
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {item.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.activeDot,  // Highlight the active dot
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Video */}
      {item?.video?.[0] && (
        <Video
          source={{ uri: item.video[0] }}
          style={[styles.postMedia, { height: hp(30) }]}
          useNativeControls
          resizeMode="cover"
          isLooping
        />
      )}

      {/* Like and Comment buttons */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={handleLike}>

            {
                liked?<FontAwesome name="heart" size={24} color={theme.Colors.rose} />:
                <Feather
              name="heart"
              size={24}
              color={theme.Colors.textLight}
            />
            }
         
            
          </TouchableOpacity>
          <Text style={styles.count}>{likes}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity>
            <FontAwesome5 name="comment" size={24} color={theme.Colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments?.length || 0}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Feather name="share" size={24} color={theme.Colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.Colors.gray,
    shadowColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userinfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.Colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  posttime: {
    fontSize: hp(1.4),
    color: theme.Colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postBody: {
    marginLeft: 5,
  },
  postMedia: {
    height: hp(40),
    width: '100%',
    borderRadius: theme.radius.xl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    color: theme.Colors.text,
    fontSize: hp(1.8),
  },
  carouselContainer: {
    alignItems: 'center',  
  },
  paginationContainer: {
    flexDirection: 'row', 
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.Colors.gray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.Colors.primary,  
  },
});
