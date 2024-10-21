import React, { useState } from 'react';
import '../css/App.css';
import TodoPage from './TodoPage';
import Signup from './Signup';
import { signInWithFirestore } from '../firebase/signin.firebase';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showTodoPage, setShowTodoPage] = useState(false);
  const [showSignupPage, setShowSignupPage] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState(''); // New state to store the logged-in username

  const handleLogin = async (e) => {
    e.preventDefault();

    // Call the Firestore login function
    const result = await signInWithFirestore(username, password);

    if (result.success) {
      console.log('Login successful!');
      setLoggedInUsername(username); // Set the logged-in username
      setShowTodoPage(true); // Redirect to TodoPage
    } else {
      console.error('Login failed:', result.message);
      alert(result.message);
    }
  };

  if (showTodoPage) {
    return <TodoPage username={loggedInUsername} />; // Pass the logged-in username to TodoPage
  }

  if (showSignupPage) {
    return <Signup />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Login</h2>
        <div className="login-user-pass-container">
          <form onSubmit={handleLogin}>
            <div>
            <label htmlFor="username" className="form-user-pass-label" >Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="form-user-pass-label" >Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
            <button onClick={() => setShowSignupPage(true)}>Sign Up</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;