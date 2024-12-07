import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { theme } from '../../../constants/theme';
import { hp } from '../../../helpers/common';
import Button from '../../../components/Button';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SignUp() {
  const router = useRouter();

  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[name,setName]=useState('');
  const [loading,setLoading]=useState(false)

  const handleSignin=()=>{
    router.replace('auth/sign-in')
  }

  const navigation = useNavigation();
  useEffect(()=>{
    navigation.setOptions({
      headerShown: false
    })
  },[]);


  const OnCreateAccount = async ()=>{
    if(!email&& !password && !name){
     Platform.OS==='android'? ToastAndroid.show('Please enter all details',ToastAndroid.BOTTOM):
     Alert.alert('Please enter all details')
      return ;
    }
    
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    router.replace('/home')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode,errorMessage)
   
  });
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
      <View style={{ padding: 25, backgroundColor: 'white', height: '100%' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.welcomeText}>Let's,</Text>
        <Text style={styles.welcomeText}>Get Started</Text>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.Colors.text }}>Please fill the details to create an account </Text>

          <View style={styles.inputContainer}>
          <AntDesign name="user" size={20} color="gray" style={styles.icon} />
           
            <TextInput
              onChangeText={(value) => setName(value)}
              style={styles.input}
              placeholder="Enter your name"
             
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              onChangeText={(value) => setEmail(value)}
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input with Icon */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="gray" style={styles.icon} />
            <TextInput
              onChangeText={(value) => setPassword(value)}
              style={styles.input}
              secureTextEntry={true}
              placeholder="Enter your password"
            />
          </View>
         
        
          <Button title={'Sign up'} loading={loading} onPress={OnCreateAccount} />

        </View>

       <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={handleSignin}>
          <Text style={[styles.footerText ,{color:theme.Colors.primaryDark,fontWeight:theme.fonts.semibold}]}>Login</Text>
        </TouchableOpacity>
       </View>

       

    
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection:'row',
    height:hp(7.2),
    alignItems:'center',
    justifyContent:'center',
    borderWidth:0.4,
    borderWidth:0.4,
    borderColor:theme.Colors.text,
    borderRadius:theme.radius.xxl,
    borderCurve:'continuous',
    paddingHorizontal:18,
    gap:12
   
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'outfit',
    borderCurve:'continuous'
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.Colors.text,
  },
  form: {
    gap: 25,
    marginTop:50
  },

  signInButton: {
    padding: 20,
    backgroundColor: 'pink',
    borderRadius: 15,
    marginTop: 50,
  },
  signUpButton: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
  },
  forgetPassword:{
    textAlign:'right',
    fontWeight:theme.fonts.semibold,
    color:theme.Colors.text
  },
  footer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5,
    marginTop:40
  },
  footerText:{
    textAlign:'center',
    color:theme.Colors.text,
    fontSize:hp(1.6)
  }
})