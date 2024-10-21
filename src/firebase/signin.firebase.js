import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Function to sign in with Firestore
export const signInWithFirestore = async (username, password) => {
  try {
    // Query Firestore for a user with matching username and password
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No user found with matching credentials
      return { success: false, message: 'Invalid username or password.' };
    }

    // User found, return success
    return { success: true, message: 'Login successful!' };
  } catch (error) {
    console.error('Error during sign-in:', error);
    return { success: false, message: 'An error occurred while logging in.' };
  }
};