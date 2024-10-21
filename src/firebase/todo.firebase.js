import { db } from './firebase';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Fetch todos for a user
export const fetchTodosFromFirestore = async (username) => {
  try {
    if (!username) {
      throw new Error('Username is undefined or empty.');
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'User not found.' };
    }

    let userDocData = null;
    querySnapshot.forEach((doc) => {
      userDocData = doc.data();
    });

    const todos = userDocData?.todos || [];
    return { success: true, todos };
  } catch (error) {
    console.error('Error fetching todos:', error);
    return { success: false, message: 'An error occurred while fetching todos.' };
  }
};

// Add a task for a user
export const addTodoToFirestore = async (username, task) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'User not found.' };
    }

    let userDoc = null;
    querySnapshot.forEach((doc) => {
      userDoc = doc;
    });

    if (!userDoc) {
      return { success: false, message: 'User document not found.' };
    }

    const userDocRef = doc(db, 'users', userDoc.id);

    await updateDoc(userDocRef, {
      todos: arrayUnion(task),
    });

    return { success: true, message: 'Task added successfully!' };
  } catch (error) {
    console.error('Error adding task:', error);
    return { success: false, message: 'An error occurred while adding the task.' };
  }
};

// Edit a task for a user
export const editTodoInFirestore = async (username, oldTask, newTask) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'User not found.' };
    }

    let userDoc = null;
    querySnapshot.forEach((doc) => {
      userDoc = doc;
    });

    if (!userDoc) {
      return { success: false, message: 'User document not found.' };
    }

    const userDocRef = doc(db, 'users', userDoc.id);

    // Remove old task and add new task
    await updateDoc(userDocRef, {
      todos: arrayRemove(oldTask),
    });
    await updateDoc(userDocRef, {
      todos: arrayUnion(newTask),
    });

    return { success: true, message: 'Task edited successfully!' };
  } catch (error) {
    console.error('Error editing task:', error);
    return { success: false, message: 'An error occurred while editing the task.' };
  }
};

// Delete a task for a user
export const deleteTodoFromFirestore = async (username, task) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'User not found.' };
    }

    let userDoc = null;
    querySnapshot.forEach((doc) => {
      userDoc = doc;
    });

    if (!userDoc) {
      return { success: false, message: 'User document not found.' };
    }

    const userDocRef = doc(db, 'users', userDoc.id);

    // Remove the task from Firestore
    await updateDoc(userDocRef, {
      todos: arrayRemove(task),
    });

    return { success: true, message: 'Task deleted successfully!' };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, message: 'An error occurred while deleting the task.' };
  }
};