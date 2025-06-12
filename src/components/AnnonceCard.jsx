import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AnnonceCard = ({ annonce }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (!e.target.closest('.voir-plus-btn') && !e.target.closest('.annonce-categorie')) {
      navigate(`/annonce/${annonce.id}`);
    }
  };

  const handleCategorieClick = (e) => {
    e.stopPropagation(); 
    if (annonce.categorie) {
      navigate(`/annonces?categorie=${annonce.categorie.nom}`);
    }
  };

  return (
    <div className='annonce-card' onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="annonce-image">
        {annonce.new && <img src="/assets/images/new_fr.svg" alt="Nouveau" className='new-badge' />}
        <img
          src={annonce.imageUrl || '/assets/images/placeholder.jpg'}
          alt={annonce.titre}
          className="annonce-background"
        />

        <div className="annonce-overlay">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none">
            <path d="M0,0 C150,100 350,0 500,100 L500,0 L0,0 Z" />
          </svg>
        </div>
      </div>
      <div className="annonce-texte flex-center">
        <div className="annonce-header flex-center">
          <p className="annonce-date">
            Publié le {new Date(annonce.datecreation).toLocaleDateString()}
          </p>
          {annonce.categorie && (
            <span
              className="annonce-categorie"
              onClick={handleCategorieClick}
              style={{ cursor: 'pointer' }}
            >
              {annonce.categorie.nom}
            </span>
          )}
        </div>
        <h3>{annonce.titre}</h3>
        <p className="annonce-description">
          {annonce.description.length > 100
            ? `${annonce.description.substring(0, 100)}...`
            : annonce.description}
        </p>
        <Link to={`/annonce/${annonce.id}`} className="voir-plus-btn">
          Voir l'annonce
        </Link>
      </div>
    </div>
  );
};

export default AnnonceCard;
