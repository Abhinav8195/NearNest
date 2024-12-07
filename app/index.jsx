import { ActivityIndicator, Text, View } from "react-native";
import Login from '../components/Login'
import { auth } from '../config/firebase';
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
    {user ? <Redirect href={'/home'} /> : <Login />}
  </View>
  );
}
