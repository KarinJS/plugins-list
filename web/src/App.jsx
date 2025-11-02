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
      // For demo purposes, we'll simulate this with a note
      console.log('OAuth code received:', code);
      alert(
        '注意：在生产环境中，需要配置后端服务来处理 OAuth 回调。\n' +
        '当前为演示模式，请使用个人访问令牌进行测试。\n\n' +
        '获取个人访问令牌：\n' +
        '1. 访问 https://github.com/settings/tokens\n' +
        '2. 生成新令牌（需要 repo 和 read:user 权限）\n' +
        '3. 在控制台输入：localStorage.setItem("github_token", "YOUR_TOKEN")\n' +
        '4. 刷新页面'
      );
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
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
