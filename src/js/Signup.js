import React, { useState } from 'react';
import '../css/App.css';
import TodoPage from './TodoPage';
import { createUserInFirestore } from '../firebase/signup.firebase';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTodoPage, setShowTodoPage] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    // Call the Firestore function to create a user
    const result = await createUserInFirestore(username, password);

    if (result.success) {
      console.log('Signup successful!');
      alert(result.message);

      // Reset form fields
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      // Redirects to login page
      window.location.href = '/login';
    } else {
      setError(result.message);
    }
  };

  if (showTodoPage) {
    return <TodoPage />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Sign Up</h2>
        <div className="login-user-pass-container">
          <form onSubmit={handleSignup}>
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
            <div>
              <label htmlFor="confirmPassword" className="form-user-pass-label" >Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="form-user-pass-label">{error}</p>}
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default Signup;