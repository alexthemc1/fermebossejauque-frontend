import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Horaire from './Horaire';
import API_BASE_URL from '../config/api';

const CommerceDetail = ({ type }) => {
  const [commerce, setCommerce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${ API_BASE_URL }/api/commerces/type/${type}`)
      .then(res => {
        console.log("Données reçues:", res.data);
        if (res.data && res.data.length > 0) {
          setCommerce(res.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(`Erreur lors de la récupération du commerce de type ${type}:`, err);
        setError(`Impossible de charger les informations. Veuillez réessayer plus tard.`);
        setLoading(false);
      });
  }, [type]);

  const YouTubeGetID = (url) => {
    if (!url) return null;

    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if (url[2] !== undefined) {
      let ID = url[2].split(/[^0-9a-z_-]/i);
      return ID[0];
    }
    return null;
  };

  const renderSection = (section) => {
    switch (section.type) {
      case 'TITRE':
        return <h2 className="section-titre" key={section.id}>{section.contenu}</h2>;

      case 'PARAGRAPHE':
        return <p className="section-paragraphe" key={section.id}>{section.contenu}</p>;

      case 'IMAGE':
        return (
          <div className="section-image" key={section.id}>
            {section.imageUrl && (
              <img
                src={section.imageUrl || '/assets/images/placeholder.jpg'}
                alt={section.contenu || 'Image'}
              />
            )}
            {section.contenu && <p className="image-caption">{section.contenu}</p>}
          </div>
        );

      case 'VIDEO':
        {
          const videoId = YouTubeGetID(section.videoUrl);
          const videoSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

          return (
            <div className="section-video" key={section.id}>
              {videoId && (
                <iframe
                  src={videoSrc}
                  title={section.contenu || 'Vidéo'}
                  width="560"
                  height="315"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
              {section.contenu && <p className="video-caption">{section.contenu}</p>}
            </div>
          );
        }

      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!commerce) return <div className="not-found">Aucune information disponible pour le moment.</div>;

  return (
    <div className="commerce-detail">
      <div className="commerce-header" style={{ backgroundImage: `url(${commerce.imageUrl || '/assets/images/placeholder.jpg'})` }}>
        <div className="commerce-header-overlay flex-center">
          <h1>{commerce.titre}</h1>
        </div>
      </div>

      <div className="commerce-infos flex-center">
        <div className="commerce-infos-contents flex-center">
          <div className="commerce-infos-content flex-center">
            <div className="commerce-description-container flex-center">
              <h2>Découvrez notre {commerce.titre}</h2>
              <p className="commerce-description">{commerce.description}</p>
            </div>
            <div className="commerce-horaires-container flex-center">
              <Horaire type={type} />
            </div>
          </div>
          <div className="commerce-infos-telephone flex-center">
            <img src="/phone-icon.svg" alt="phone-icon" />
            <h3>{commerce.type} :</h3>
            <a href={`tel:${commerce.telephone}`}>{commerce.telephone}</a>
          </div>
        </div>
      </div>

      <div className="commerce-content">
        {commerce.sections && commerce.sections.length > 0 ? (
          <div className="commerce-sections">
            {commerce.sections.map(section => renderSection(section))}
          </div>
        ) : (
          <p>Ce commerce ne contient pas de sections supplémentaires.</p>
        )}

        {commerce.galerie && commerce.galerie.length > 0 && (
          <div className="commerce-galerie">
            <h2>Galerie</h2>
            <div className="galerie-grid">
              {commerce.galerie.map(image => (
                <div key={image.id} className="galerie-item">
                  <img src={image.imageUrl || '/assets/images/placeholder.jpg'} alt={image.description || ''} />
                  {image.description && <p className="galerie-description">{image.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommerceDetail;
