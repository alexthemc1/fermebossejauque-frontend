import React from 'react';
import { Link } from 'react-router-dom';
import AnnonceCard from './AnnonceCard';

const AnnoncesGrid = ({ annonces, montrerLiens = false, categorie = null }) => {
  const TouteAnnoncesUrl = categorie ? `/annonces?categorie=${categorie}` : '/annonces';
  
  return (
    <div className="annonces-grid">
      {annonces.map((annonce) => (
        <AnnonceCard key={annonce.id} annonce={annonce} />
      ))}
      
      {montrerLiens && (
        <Link to={TouteAnnoncesUrl} className="voir-plus-btn">
          Voir nos {categorie === 'recettes' ? 'recettes' : categorie === 'evenements' ? 'événements' : 'annonces'}...
        </Link>
      )}
    </div>
  );
};

export default AnnoncesGrid;
