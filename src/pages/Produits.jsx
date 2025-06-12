import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const Produits = () => {
  const [commerces, setCommerces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${ API_BASE_URL }/api/commerces`)
      .then(res => {
        setCommerces(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des commerces:', err);
        setError('Impossible de charger les commerces.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  const magasin = commerces.find(commerce => commerce.type === 'MAGASIN');
  const boucherie = commerces.find(commerce => commerce.type === 'BOUCHERIE');

  return (
    <div className="produits-page">
      <div className="produits-container">
        {magasin && (
          <Link to="/magasin">
            <div className="produit-card flex-center" style={{ backgroundImage: `url(${magasin.imageUrl || '/assets/images/placeholder.jpg'})` }}>
              <div className="produit-content flex-center">
                <h2>{magasin.titre}</h2>
                <button className="bouton1">
                  Découvrir
                </button>
              </div>
            </div>
          </Link>
        )}

        {boucherie && (
          <Link to="/boucherie">
            <div className="produit-card flex-center" style={{ backgroundImage: `url(${boucherie.imageUrl || '/assets/images/placeholder.jpg'})` }}>
              <div className="produit-content flex-center">
                <h2>{boucherie.titre}</h2>
                <button className="bouton2">
                  Découvrir
                </button>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Produits;
