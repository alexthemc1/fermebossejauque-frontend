import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
const Histoire = () => {
  const [histoires, setHistoires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);

    axios.get(`${ API_BASE_URL }/api/histoires`)
      .then(response => {
        console.log('Histoires reçues:', response.data);
        const historiesTriees = response.data.sort((a, b) => a.annee - b.annee);
        const historiesAvecImages = historiesTriees.map(histoire => {
          return {
            ...histoire,
            imageUrl: `/assets/images/${histoire.imageUrl}`
          };
        });

        setHistoires(historiesAvecImages);
        setLoading(false);
      })
      .catch(erreur => {
        console.error('Erreur lors de la récupération des données:', erreur);
        setError('Impossible de charger les histoires');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='histoire-ferme'>
    <div className='histoire-ferme-intro flex-center'>
      <h1>Histoire de la Ferme de la Bosse Jauque</h1>
      </div>
    <div className='histoire-ferme-content'>

      {histoires.length === 0 ? (
        <p>Aucune histoire disponible pour le moment.</p>
      ) : (
        <div className="histoire">
          <div className="histoire-line"></div>

          {histoires.map((histoire, index) => (
            <div
              key={histoire.id}
              className={index % 2 === 0 ? "histoire-item gauche" : "histoire-item droite"}
            >
              <div className="histoire-content">
                <div className="histoire-annee"><h2>{histoire.annee}</h2></div>
                <h2 className="histoire-title">{histoire.titre}</h2>
                <p className="histoire-description">{histoire.description}</p>
                {histoire.imageUrl && (
                  <img
                    src={histoire.imageUrl}
                    alt={histoire.titre}
                    className="histoire-image"
                  />
                )}
              </div>
              <div className="histoire-dot"></div>
            </div>
          ))}
        </div>
      )}
      <div className="histoire-conclusion flex-center">
      <div className="histoire-conclusion-content flex-center">
        <h2>Et l’aventure continue…</h2>
        <p>De nombreux projets continuent à germer dans l’esprit <strong>passionné</strong> de cette belle famille de <strong>trois générations</strong>, animée par la même ambition: <strong>sublimer et partager</strong> les délicieux produits naturels de la Bosse Jauque.</p>
        <img src="/assets/images/famille.jpg" alt="photo de famille" />
      </div>
      </div>
    </div>
    </div>
  );
};

export default Histoire;
