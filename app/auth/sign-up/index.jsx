import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Platform, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { theme } from '../../../constants/theme';
import { hp } from '../../../helpers/common';
import Button from '../../../components/Button';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function SignUp() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const handleSignin = () => {
    router.replace('auth/sign-in');
  };

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPhoneNumberValid = (phone) => {
    const phoneRegex = /^\d{10}$/; // Adjust this regex based on your requirements
    return phoneRegex.test(phone);
  };

  const isPasswordValid = (password) => {
    const minLength = 8;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return password.length >= minLength && specialCharRegex.test(password);
  };

  const OnCreateAccount = async () => {
    if (!isPhoneNumberValid(phone)) {
      Platform.OS === 'android'
        ? ToastAndroid.show('Phone number must be exactly 10 digits.', ToastAndroid.LONG)
        : Alert.alert('Phone number must be exactly 10 digits.');
      return;
    }

    if (!email || !password || !name || !phone) {
      Platform.OS === 'android'
        ? ToastAndroid.show('Please enter all details', ToastAndroid.BOTTOM)
        : Alert.alert('Please enter all details');
      return;
    }

    if (!isEmailValid(email)) {
      Platform.OS === 'android'
        ? ToastAndroid.show('Invalid email format.', ToastAndroid.LONG)
        : Alert.alert('Invalid email format.');
      return;
    }

    if (!isPasswordValid(password)) {
      Platform.OS === 'android'
        ? ToastAndroid.show('Password must be at least 8 characters long and contain a special character.', ToastAndroid.LONG)
        : Alert.alert('Password must be at least 8 characters long and contain a special character.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        phone: phone,
        email: email,
        uid: user.uid,
        private: true,
      });
      router.replace('/home');
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message) => {
    Platform.OS === 'android' ? ToastAndroid.show(message, ToastAndroid.LONG) : Alert.alert(message);
  };

  const handleAuthError = (error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === 'auth/email-already-in-use') {
      showAlert('Email is already registered.');
    } else {
      showAlert(errorMessage);
    }
  };

  const handleInputFocus = (index) => {
    setTimeout(() => {
      scrollViewRef.current.scrollTo({
        y: index * 100,
        animated: true,
      });
    }, 300);
  };

  return (
    <SafeAreaView   style={{ flex: 1,backgroundColor:'white' }}>
    <KeyboardAvoidingView
    
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={scrollViewRef}>
        <View style={{ padding: 25, backgroundColor: 'white', flex: 1 }}>
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
                value={name}
                onFocus={() => handleInputFocus(1)} 
              />
            </View>

            {/* Phone number */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                onChangeText={(value) => setPhone(value)}
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                maxLength={10}
                onFocus={() => handleInputFocus(2)} 
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
              <TextInput
                onChangeText={(value) => setEmail(value)}
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onFocus={() => handleInputFocus(3)} 
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
                value={password}
                onFocus={() => handleInputFocus(4)} 
              />
            </View>

            <Button title={'Sign up'} loading={loading} onPress={OnCreateAccount} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignin}>
              <Text style={[styles.footerText, { color: theme.Colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.Colors.text,
    borderRadius: theme.radius.xxl,
    paddingHorizontal: 18,
    gap: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'outfit',
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.Colors.text,
  },
  form: {
    gap: 25,
    marginTop: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 40,
  },
  footerText: {
    textAlign: 'center',
    color: theme.Colors.text,
    fontSize: hp(1.6),
  },
});
