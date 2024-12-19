import { db, auth } from '../config/firebase';
import { collection, getDocs,query, orderBy  } from 'firebase/firestore';

export const fetchPosts = async () => {
    if (!auth.currentUser) {
      return [];
    }
  
    try {
      const postsCollectionRef = collection(db, 'posts', auth.currentUser.uid, 'userPosts');
      const postsQuery = query(postsCollectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
  
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };