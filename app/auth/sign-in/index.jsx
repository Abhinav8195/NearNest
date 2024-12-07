import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../config/firebase.js';
import { theme } from '../../../constants/theme.js';
import { hp } from '../../../helpers/common.js';
import Button from '../../../components/Button.jsx';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlesignup = async () => {
    router.replace('auth/sign-up')
  }

  const OnSignIn = () => {
    if (!email && !password) {
      Platform.OS==='android'?ToastAndroid.show('Please Enter Email & Password', ToastAndroid.LONG):
      Alert.alert("Please Enter Email & Password")
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.replace('/home')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        if (errorCode == 'auth/invalid-credential') {
          ToastAndroid.show('Invalid Email or Password', ToastAndroid.LONG)
        }
      });
  }

  const handleForget = () => {
    router.push('auth/reset-password');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 25, backgroundColor: 'white', height: '100%' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.welcomeText}>Hey,</Text>
        <Text style={styles.welcomeText}>Welcome Back</Text>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.Colors.text }}>Please login to continue</Text>

          
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
          <TouchableOpacity onPress={handleForget}>
          <Text style={styles.forgetPassword}> Forget Password?</Text>
          </TouchableOpacity>
        
          <Button title={'Login'} loading={loading} onPress={OnSignIn} />

        </View>

       <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handlesignup}>
          <Text style={[styles.footerText ,{color:theme.Colors.primaryDark,fontWeight:theme.fonts.semibold}]}>Sing up</Text>
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
