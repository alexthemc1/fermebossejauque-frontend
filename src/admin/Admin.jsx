import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Horaires from './pages/Horaires';
import Annonce from './pages/Annonce';
import AnnonceDetail from './pages/AnnonceDetail';
import Commerce from './pages/Commerce';
import CommerceDetail from './pages/CommerceDetail';
import './Admin.scss'; 
import API_BASE_URL from '../config/api';

function Admin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const Autentification = sessionStorage.getItem('adminAutentification') === 'true';
    const username = sessionStorage.getItem('adminLogin');
    
    if (!Autentification || !username) {
      window.location.href = '/admin-login';
      return;
    }
    
    axios.get(`${ API_BASE_URL }/api/admin/check-auth?username=${username}`)
      .then(response => {
        if (!response.data.authenticated) {
          sessionStorage.removeItem('adminAutentification');
          sessionStorage.removeItem('adminLogin');
          window.location.href = '/admin-login';
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur de vérification d\'authentification:', error);
        setLoading(false);
      });
  }, []);

  const deconnexion = () => {
    sessionStorage.removeItem('adminAutentification');
    sessionStorage.removeItem('adminLogin');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Administration - Ferme de la Bosse Jauque</h1>
        <button onClick={deconnexion} className="bouton2">
          Déconnexion
        </button>
      </header>
      
      <div className="admin-content">
        <nav className="admin-sidebar">
          <ul>
            <li>
              <Link to="/adminfermebossejauque/Commerces">Commerces</Link>
            </li>
            <li>
              <Link to="/adminfermebossejauque/Horaires">Horaires</Link>
            </li>
            <li>
              <Link to="/adminfermebossejauque/Annonces">Annonces</Link>
            </li>
          </ul>
        </nav>
        
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Commerce />} />
            <Route path="/Commerces" element={<Commerce />} />
            <Route path="/Commerces/:id" element={<CommerceDetail />} />
            <Route path="/Horaires" element={<Horaires />} />
            <Route path="/Annonces" element={<Annonce />} />
            <Route path="/Annonces/:id" element={<AnnonceDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Admin;
