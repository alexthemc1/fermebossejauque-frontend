import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.scss';
import API_BASE_URL from '../config/api';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${ API_BASE_URL }/api/admin/login`, {
        username,
        password
      });
      
      if (response.data.success) {
        sessionStorage.setItem('adminAutentification', 'true');
        sessionStorage.setItem('adminLogin', username);
        navigate('/adminfermebossejauque');
      } else {
        setError('Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.response?.data?.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Administration - Ferme de la Bosse Jauque</h1>
      </header>
      <div className="admin-login-content">
        <div className="admin-login-form">
          <h2>Connexion à l'administration</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;