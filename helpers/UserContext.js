import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId) => {
    try {
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchUserProfile(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
