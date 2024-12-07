import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

const Home = () => {
  return (
   <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>NearNest</Text>
            <View style={styles.icons}>
              <Pressable onPress={()=>router.push('notification')}>
              <AntDesign name="hearto" size={hp(3.2)} strokeWidth={2} color={theme.Colors.text} />
              </Pressable>
              <Pressable>
              <Ionicons name="paper-plane-outline" size={hp(3.2)} strokeWidth={2} color={theme.Colors.text} />
              </Pressable>
            </View>
        </View>
      </View>
   </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex:1
  },header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:10,
    marginHorizontal:wp(4)
  },
  title:{
    color:theme.Colors.text,
    fontSize:hp(3.2),
    fontWeight:theme.fonts.bold
  },avatarImage:{
    height:hp(4.3),
    width:hp(4.3),
    borderRadius:theme.radius.sm,
    borderCurve:'continuous',
    borderColor:theme.Colors.gray,
    borderWidth:3
  },
  icons:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:18
  },
  listStyle:{
    paddingTop:20,
    paddingHorizontal:wp(4)
  },
  noPosts:{
    fontSize:hp(2),
    textAlign:'center',
    color:theme.Colors.text
  }
})