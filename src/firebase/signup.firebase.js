import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Function to create a user in Firestore
export const createUserInFirestore = async (username, password) => {
  try {
    // Check if username already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, message: 'Username already exists. Please choose another one.' };
    }

    // Generate a UUID
    const uid = uuidv4();

    // Add new user to Firestore with the generated UUID
    await addDoc(usersRef, { uid, username, password, todos: [] });

    return { success: true, message: 'User created successfully!', uid: uid };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'An error occurred while creating the user.' };
  }
};