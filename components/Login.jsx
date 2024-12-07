import { View, Text, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import {hp,wp} from '../helpers/common'
import { theme } from '../constants/theme'
import Button from './Button'

const  Login=()=> {

    const router = useRouter()
  return (
    <View style={styles.container}>

      <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')} />
      
      <View style={{gap:20}}>
        <Text style={styles.title}>NearNest</Text>
        <Text style={styles.punchline}>Connect, Discover, Belong.</Text>
      </View>
      
      <View style={styles.footer}>
        <Button
        title="Getting Started"
        buttonStyle={{marginHorizontal:wp(3)}}
        onPress={()=>router.push('auth/sign-up')}
        />
        <View style={styles.bottomTextContainer}>
          <Text style={styles.loginText}>Already have an account!</Text>
        
        <Pressable onPress={()=>router.push('auth/sign-in')}>
          <Text style={[styles.loginText,{color:theme.Colors.primaryDark,fontWeight:theme.fonts.semibold}]}>
            Login
          </Text>
        </Pressable>
        </View>
      </View>
      {/* <TouchableOpacity onPress={()=>router.push('auth/sign-in')} style={{backgroundColor:'#D4D4D4'}}>
        <Text>
        Login
        </Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'space-around',
    backgroundColor:'white',
    paddingHorizontal:wp(4)
  },
  welcomeImage:{
    height:hp(30),
    width:wp(100),
    alignSelf:'center'
  },
  title:{
    color:theme.Colors.text,
    fontSize:hp(4),
    textAlign:'center',
    fontWeight:theme.fonts.extraBold
  },
  punchline:{
    textAlign:'center',
    paddingHorizontal:wp(10),
    fontSize:hp(1.7),
    color:theme.Colors.text
  },
  footer:{
    gap:30,
    width:'100%'
  },
  bottomTextContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5
  },
  loginText:{
    textAlign:'center',
    color:theme.Colors.text,
    fontSize:hp(1.6)
  }
})