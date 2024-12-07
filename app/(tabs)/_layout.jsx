import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import Avatar from '../../components/Avatar'
import { hp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import {auth} from '../../config/firebase';
import defaultUserImage from '../../assets/images/defaultUser.png';


export default function TabLayout() {
  
  const colorScheme = useColorScheme();
  const router = useRouter();

  const navigateToPost = () => {
    router.push('/post'); 
  }

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome name="tachometer" size={24} color="black" />,
        }}
      />
        <Tabs.Screen
        name="post"
        options={{
          title: '',
          tabBarIcon: ({ color }) =>  <Feather name="plus-square" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) =><Avatar uri={ defaultUserImage} size={hp(3.3)} rounded={theme.radius.sm} style={{borderWidth:2}}/>,
        }}
      />
    </Tabs>
  );
}
