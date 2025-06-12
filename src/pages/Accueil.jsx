import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnnoncesGrid from '../components/AnnoncesGrid';
import Horaire from '../components/Horaire';
import API_BASE_URL from '../config/api';

const Accueil = () => {
  const [recettes, setRecettes] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${ API_BASE_URL }/api/annonces?include=categorie`)
      .then(res => {
        const recetteAnnonces = res.data.filter(annonce =>
          annonce.categorie && annonce.categorie.nom === "recettes"
        );

        const evenementAnnonces = res.data.filter(annonce =>
          annonce.categorie && annonce.categorie.nom === "evenements"
        );

        const trieRecettes = recetteAnnonces.sort((a, b) =>
          new Date(b.datecreation) - new Date(a.datecreation)
        );

        const trieEvenements = evenementAnnonces.sort((a, b) =>
          new Date(b.datecreation) - new Date(a.datecreation)
        );
        setRecettes(trieRecettes.slice(0, 4));
        setEvenements(trieEvenements.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des annonces:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="accueil">
      <div className="accueil-header flex-center">
        <div className="accueil-content flex-center">
          <h1>Bienvenue à la ferme<br /> de la Bosse Jauque</h1>
          <h2>La qualité, la passion et le naturel d'antan dans vos assiettes !</h2>
          <div className="accueil-buttons flex-center">
            <Link to="/magasin" className="bouton1">Magasin</Link>
            <Link to="/boucherie" className="bouton2">Boucherie</Link>
          </div>
        </div>
      </div>
      <div className="accueil-info flex-center">
        <div className="accueil-widget">
          <div className="accueil-widget-card flex-center">
            <img src="/assets/images/icon1.svg" alt="icon1" />
            <p>Fraîcheur locale et saveurs du terroir réunies ici.</p>
          </div>
          <div className="accueil-widget-card flex-center">
            <img src="/assets/images/icon2.svg" alt="icon2" />
            <p>Agriculture durable, moteur d'un avenir plus vert.</p>
          </div>
          <div className="accueil-widget-card flex-center">
            <img src="/assets/images/icon3.svg" alt="icon3" />
            <p>Élevage respectueux pour des produits de qualité.</p>
          </div>
          <div className="accueil-widget-card flex-center">
            <img src="/assets/images/icon4.svg" alt="icon4" />
            <p>Des événements pour petits et grands, toute l'année.</p>
          </div>
        </div>
        <div className="accueil-horaire flex-center">
          <div className="accueil-horaire-card">
            <div className="intro">
              <h2 className='intro-titre'>Saveurs des champs, plaisirs d'antan.</h2>
              <p className='intro-text'>
                Chez nous, la <strong>fraîcheur</strong> est au rendez-vous chaque jour de la semaine !
                Venez faire un tour dans notre <strong>magasin</strong> et notre <strong>boucherie</strong> pour découvrir une sélection généreuse de <em>légumes</em>, <em>viandes</em> et bien plus encore.
                De quoi partager de <strong>vrais bons moments</strong> autour de la table.
              </p>
              <div className="accueil-contact flex-center">
                <ul>
                  <li className="infos-item">
                    <img src="/location-icon.svg" alt="location" />
                    <p>Chemin de Silly 11 - 7823 Gibecq</p>
                  </li>
                  <li className="infos-item">
                    <img src="/mail-icon.svg" alt="mail" />
                    <p>fermedelabossejauque@gmail.com</p>
                  </li>
                  <li className="infos-item">
                    <img src="/phone-icon.svg" alt="phone-magasin" />
                    <p>Telephone du magasin : +32 0 496 31 39 86</p>
                  </li>
                  <li className="infos-item">
                    <img src="/phone-icon.svg" alt="phone-boucherie" />
                    <p>Telephone de la boucherie : +32 0 476 03 29 69</p>
                  </li>
                </ul>
              </div>
            </div>
            <Horaire type="ALL" />
          </div>
        </div>
        <div className="separator-banner flex-center">
        </div>
      </div>
      <div className="annonces-main">
        <div className="liste-annonces">
          <h2>Nos derniers événements</h2>
          <AnnoncesGrid annonces={evenements} showAllLink={true} categorie="evenements" />
        </div>
        <div className="liste-annonces">
          <h2>Nos dernières recettes</h2>
          <AnnoncesGrid annonces={recettes} showAllLink={true} categorie="recettes" />
        </div>
      </div>
    </div>
  );

};
export default Accueil;
