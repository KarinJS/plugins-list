import { useState, useEffect } from 'react';
import './SubmissionPage.css';

const SubmissionPage = ({ accessToken, user, onLogout }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [existingPlugins, setExistingPlugins] = useState(new Set());

  // Load existing plugins from plugins.json
  useEffect(() => {
    const loadExistingPlugins = async () => {
      try {
        const response = await fetch('/plugins-list/plugins.json');
        const data = await response.json();
        const pluginNames = new Set(data.plugins.map(p => p.name));
        setExistingPlugins(pluginNames);
      } catch (err) {
        console.error('Failed to load existing plugins:', err);
      }
    };
    loadExistingPlugins();
  }, []);

  // Fetch user's repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        
        // Fetch package.json for each repository
        const reposWithPackageJson = await Promise.all(
          repos.map(async (repo) => {
            try {
              const packageResponse = await fetch(
                `https://api.github.com/repos/${repo.full_name}/contents/package.json`,
                {
                  headers: {
                    Authorization: `token ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                  },
                }
              );

              if (packageResponse.ok) {
                const packageData = await packageResponse.json();
                const content = JSON.parse(atob(packageData.content));
                return {
                  ...repo,
                  packageJson: content,
                };
              }
            } catch {
              // Repository doesn't have package.json or error occurred
            }
            return null;
          })
        );

        // Filter out repositories without package.json
        const validRepos = reposWithPackageJson.filter(repo => repo !== null);
        setRepositories(validRepos);

        // Auto-select repositories already in the marketplace
        const autoSelected = new Set();
        validRepos.forEach(repo => {
          if (repo.packageJson?.name && existingPlugins.has(repo.packageJson.name)) {
            autoSelected.add(repo.id);
          }
        });
        setSelectedRepos(autoSelected);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchRepositories();
    }
  }, [accessToken, existingPlugins]);

  const handleRepoToggle = (repoId) => {
    setSelectedRepos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(repoId)) {
        newSet.delete(repoId);
      } else {
        newSet.add(repoId);
      }
      return newSet;
    });
  };

  const checkNpmPackage = async (packageName) => {
    try {
      const response = await fetch(`https://registry.npmjs.com/${packageName}/latest`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (selectedRepos.size === 0) {
      alert('请至少选择一个仓库');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const selectedRepositories = repositories.filter(repo => selectedRepos.has(repo.id));
      
      // Validate npm packages for non-app plugins
      const validationResults = [];
      for (const repo of selectedRepositories) {
        const packageName = repo.packageJson?.name;
        if (!packageName) {
          validationResults.push({
            repo: repo.name,
            success: false,
            message: 'package.json 中缺少 name 字段',
          });
          continue;
        }

        // Check if it's a single JS file (app type)
        // More robust detection: check for main/module/exports and package type
        const isAppType = !packageName.startsWith('@') && // Not scoped package
                         !repo.packageJson.main && 
                         !repo.packageJson.module && 
                         !repo.packageJson.exports &&
                         repo.packageJson.type !== 'module';
        
        if (!isAppType) {
          // Check npm package exists
          const npmExists = await checkNpmPackage(packageName);
          if (!npmExists) {
            validationResults.push({
              repo: repo.name,
              success: false,
              message: `npm 包 "${packageName}" 不存在`,
            });
            continue;
          }
        }

        validationResults.push({
          repo: repo.name,
          packageName,
          success: true,
          isAppType,
        });
      }

      // Show validation results
      const failedValidations = validationResults.filter(v => !v.success);
      if (failedValidations.length > 0) {
        const messages = failedValidations.map(v => `${v.repo}: ${v.message}`).join('\n');
        alert(`验证失败:\n${messages}`);
        setSubmitting(false);
        return;
      }

      // Show success message with instructions
      const successRepos = validationResults.filter(v => v.success);
      const repoList = successRepos.map(v => 
        `- ${v.repo} (${v.packageName})${v.isAppType ? ' [单JS文件]' : ' [npm包]'}`
      ).join('\n');
      
      alert(
        `验证成功！以下仓库可以提交：\n\n${repoList}\n\n` +
        `请在 GitHub 上创建 Pull Request 来提交这些插件。\n` +
        `您需要手动编辑 plugins.json 文件添加插件信息。`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="submission-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="submission-container">
      <div className="submission-header">
        <div className="user-info">
          <img src={user?.avatar_url} alt="Avatar" className="user-avatar" />
          <span className="user-name">{user?.login}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          退出登录
        </button>
      </div>

      <div className="submission-content">
        <h1>选择要提交的插件</h1>
        <p className="subtitle">
          选择包含 package.json 的仓库提交到插件市场。
          已提交的插件会自动勾选。
        </p>

        {error && <div className="error-message">{error}</div>}

        {repositories.length === 0 ? (
          <div className="no-repos">
            未找到包含 package.json 的仓库
          </div>
        ) : (
          <>
            <div className="repo-list">
              {repositories.map((repo) => {
                const isSelected = selectedRepos.has(repo.id);
                const isExisting = repo.packageJson?.name && existingPlugins.has(repo.packageJson.name);
                
                return (
                  <div
                    key={repo.id}
                    className={`repo-item ${isSelected ? 'selected' : ''} ${isExisting ? 'existing' : ''}`}
                    onClick={() => handleRepoToggle(repo.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="repo-checkbox"
                    />
                    <div className="repo-info">
                      <div className="repo-name">
                        {repo.name}
                        {isExisting && <span className="badge">已提交</span>}
                      </div>
                      <div className="repo-description">
                        {repo.description || '无描述'}
                      </div>
                      {repo.packageJson?.name && (
                        <div className="package-name">
                          包名: {repo.packageJson.name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="submit-section">
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting || selectedRepos.size === 0}
              >
                {submitting ? '验证中...' : `提交 (${selectedRepos.size})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionPage;
