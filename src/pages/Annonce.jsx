import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import API_BASE_URL from '../config/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Annonces = () => {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const numericId = parseInt(id, 10);
    setLoading(true);
    setError(null);

    axios.get(`${ API_BASE_URL }/api/annonces/${numericId}`)
      .then(response => {
        setAnnonce(response.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.response) {
          setError(`Erreur: ${err.response.status} - L'annonce n'a pas été trouvée ou le serveur a rencontré un problème.`);
        } else if (err.request) {
          setError("Le serveur ne répond pas. Vérifiez que votre API est en cours d'exécution.");
        } else {
          setError(`Une erreur est survenue: ${err.message}`);
        }
        setLoading(false);
      });
  }, [id]);

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
            <img
              src={section.imageUrl || '/assets/images/placeholder.jpg'}
              alt={section.contenu || 'Image'}
            />
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

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!annonce) return <div>Annonce non trouvée</div>;

  return (
    <div className="annonce-detail flex-center">
      <div
        className="annonce-banniere flex-center"
        style={{ backgroundImage: `url(${annonce.imageUrl || '/assets/images/placeholder.jpg'})` }}
      >
        <h1>{annonce.titre}</h1>
      </div>

      <div className="annonce-detail-content">
        <p className="annonce-description">{annonce.description}</p>

        <div className="annonce-meta">
          <p>Date de publication: {new Date(annonce.datecreation).toLocaleDateString()}</p>
          {annonce.categorie && (
            <p>Catégorie: {annonce.categorie.nom}</p>
          )}
        </div>
        
        {annonce.sections && annonce.sections.length > 0 ? (
          <div className="annonce-sections">
            {annonce.sections.map(section => renderSection(section))}
          </div>
        ) : (
          <p>Cette annonce ne contient pas de sections supplémentaires.</p>
        )}

        {annonce.galerie && annonce.galerie.length > 0 && (
          <div className="annonce-galerie">
            <h2>Galerie d'images</h2>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              navigation
              pagination={{ clickable: true }}
              className="galerie-swiper"
            >
              {annonce.galerie.map((image) => (
                <SwiperSlide key={image.id}>
                  <img 
                    src={image.imageUrl || '/assets/images/placeholder.jpg'} 
                    alt={image.description || 'Image'} 
                  />
                  {image.description && (
                    <div className="swiper-caption">{image.description}</div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

      </div>
    </div>
  );
};

export default Annonces;