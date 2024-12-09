import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { StreamChat } from 'stream-chat';
import { ActivityIndicator } from 'react-native';


export default function chat() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Assuming you have your user ID and token
    const userId = 'example-user-id';
    const userToken = 'example-user-token';
    const client = StreamChat.getInstance('ts3zy4rvm9gj'); // Replace with your API key

    client.connectUser(
      {
        id: userId,
        name: 'User Name',
      },
      userToken
    ).then(() => {
      setUser({
        id: userId,
        name: 'User Name',
      });
      setToken(userToken);
      setLoading(false);
    });

    // Clean up the connection when the component is unmounted
    return () => {
      client.disconnectUser();
    };
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <Text>Stream Chat Connected!</Text>
      <Text>Welcome, {user.name}</Text>
    </View>
  );
}
