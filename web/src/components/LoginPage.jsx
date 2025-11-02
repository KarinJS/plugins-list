import { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    // GitHub OAuth App configuration
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_CLIENT_ID';
    const redirectUri = encodeURIComponent(window.location.origin + '/plugins-list/');
    const scope = 'repo,read:user';
    
    // Redirect to GitHub OAuth
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Karin 插件市场</h1>
        <p className="subtitle">提交您的插件到 Karin 插件市场</p>
        
        <div className="login-content">
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>自动检测已提交的插件</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>验证 npm 包存在性</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>简化提交流程</span>
            </div>
          </div>

          <button 
            className="github-login-btn"
            onClick={handleGitHubLogin}
            disabled={isLoading}
          >
            <svg className="github-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            {isLoading ? '登录中...' : '使用 GitHub 登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
