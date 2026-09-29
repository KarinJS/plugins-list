import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SubmissionPage from './components/SubmissionPage';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem('github_token');
    const storedUser = localStorage.getItem('github_user');
    
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }

    // Check for OAuth callback with code parameter
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // In a production app, you would exchange this code for an access token
      // using a backend service (can't expose client secret in frontend)
      // For demo purposes, we'll redirect to the token setup page
      console.log('OAuth code received:', code);
      
      // Clean up URL and redirect to token setup
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.href = './token-setup.html';
      return;
    }

    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem('github_token', token);
    localStorage.setItem('github_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        加载中...
      </div>
    );
  }

  return (
    <div className="app">
      {accessToken && user ? (
        <SubmissionPage 
          accessToken={accessToken} 
          user={user} 
          onLogout={handleLogout}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
