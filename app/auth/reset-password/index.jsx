import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../config/firebase.js';
import { theme } from '../../../constants/theme.js';
import { hp } from '../../../helpers/common.js';
import Button from '../../../components/Button.jsx';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Platform.OS === 'android'
        ? ToastAndroid.show('Please Enter Email', ToastAndroid.LONG)
        : Alert.alert('Please Enter Email');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Platform.OS === 'android'
        ? ToastAndroid.show('Password reset email sent', ToastAndroid.LONG)
        : Alert.alert('Password reset email sent');
      setLoading(false);
      router.replace('/auth/sign-in');
    } catch (error) {
      setLoading(false);
      const errorMessage = error.message;
      Platform.OS === 'android'
        ? ToastAndroid.show(errorMessage, ToastAndroid.LONG)
        : Alert.alert(errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 25, backgroundColor: 'white', height: '100%' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.welcomeText}>Reset Password</Text>
        <Text style={{ fontSize: hp(1.5), color: theme.Colors.text }}>
          Please enter your email to reset your password
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              onChangeText={(value) => setEmail(value)}
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
            />
          </View>

          <Button title={'Reset Password'} loading={loading} onPress={handleResetPassword} />
        </View>
      </View>
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
    marginBottom: 20,
  },
  form: {
    gap: 25,
    marginTop: 50,
  },
});
