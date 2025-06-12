import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const Horaire = ({ type }) => {
  const [chargement, setChargement] = useState(true);
  const [horaires, setHoraires] = useState({
    MAGASIN: [],
    BOUCHERIE: []
  });
  const [erreur, setErreur] = useState(null);

  const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    const chargerHoraires = async () => {
      try {
        const reponse = await axios.get(`${API_BASE_URL}/api/horaires`);

        const horairesMagasin = reponse.data.filter(h => h.typecommerce === 'MAGASIN');
        const horairesBoucherie = reponse.data.filter(h => h.typecommerce === 'BOUCHERIE');

        const horairesMagasinTries = trierParJour(horairesMagasin, joursSemaine);
        const horairesBoucherieTries = trierParJour(horairesBoucherie, joursSemaine);

        setHoraires({
          MAGASIN: horairesMagasinTries,
          BOUCHERIE: horairesBoucherieTries
        });
        setChargement(false);
      } catch (erreur) {
        console.error('Erreur lors du chargement des horaires:', erreur);
        setErreur('Impossible de charger les horaires');
        setChargement(false);
      }
    };
    chargerHoraires();
  }, []);

  const trierParJour = (listeHoraires, jours) => {
    return [...listeHoraires].sort((a, b) =>
      jours.indexOf(a.jour) - jours.indexOf(b.jour)
    );
  };

  const texteHoraire = (horaire) => {
    if (!horaire.status) {
      return "Fermé";
    }
    return `${horaire.ouverture} - ${horaire.fermeture}`;
  };

  if (chargement) return <div>Chargement des horaires...</div>;
  if (erreur) return <div>Erreur: {erreur}</div>;

  const afficherMagasin = type === 'MAGASIN' || type === 'ALL';
  const afficherBoucherie =  type === 'BOUCHERIE' || type === 'ALL';

  return (
    <div className="horaires-container flex-center">
      <h2>Nos horaires d'ouverture</h2>
      <div className="horaires-main">
        {afficherMagasin && (
          <div className="horaires-magasin">
            <div className="horaires-card">
              <div className="horaires-header">
                <div className="horaires-icon">
                  <img src="/assets/images/magasin-icon.svg" alt="icon-magasin" />
                </div>
                <h3>Magasin</h3>
              </div>
              <div className="horaires-liste">
                {horaires.MAGASIN.length > 0 ? (
                  horaires.MAGASIN.map(horaire => (
                    <div className="horaires-jour" key={horaire.id}>
                      <span className="jour">{horaire.jour}</span>
                      <span className="heures">{texteHoraire(horaire)}</span>
                    </div>
                  ))
                ) : (
                  <div className="horaires-jour">
                    <span>Aucun horaire disponible</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {afficherBoucherie && (
          <div className="horaires-boucherie">
            <div className="horaires-card">
              <div className="horaires-header">
                <div className="horaires-icon">
                  <img src="/assets/images/boucherie-icon.svg" alt="boucherie-icon" />
                </div>
                <h3>Boucherie</h3>
              </div>
              <div className="horaires-liste">
                {horaires.BOUCHERIE.length > 0 ? (
                  horaires.BOUCHERIE.map(horaire => (
                    <div className="horaires-jour" key={horaire.id}>
                      <span className="jour">{horaire.jour}</span>
                      <span className="heures">{texteHoraire(horaire)}</span>
                    </div>
                  ))
                ) : (
                  <div className="horaires-jour">
                    <span>Aucun horaire disponible</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Horaire;
