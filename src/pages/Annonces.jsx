import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AnnoncesGrid from '../components/AnnoncesGrid';
import API_BASE_URL from '../config/api';

const ListeAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(location.search);
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setSortOrder(orderParam);
    }
    axios.get(`${ API_BASE_URL }/api/annonces?include=categorie`)
      .then(res => {
        const categorie = searchParams.get('categorie');

        let annoncesAffichees = res.data;

        if (categorie) {
          annoncesAffichees = annoncesAffichees.filter(annonce =>
            annonce.categorie && annonce.categorie.nom === categorie
          );
        }

        annoncesAffichees.sort((a, b) => {
          const dateA = new Date(a.datecreation);
          const dateB = new Date(b.datecreation);
          return orderParam === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setAnnonces(annoncesAffichees);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError('Impossible de charger les annonces');
        setLoading(false);
      });
  }, [location.search]);

  const filtrageCategorie = (nouvelleCategorie) => {
    const searchParams = new URLSearchParams(location.search);

    if (nouvelleCategorie) {
      searchParams.set('categorie', nouvelleCategorie);
    } else {
      searchParams.delete('categorie');
    }

    if (sortOrder) {
      searchParams.set('order', sortOrder);
    }

    navigate(`/annonces?${searchParams.toString()}`);
  };

  const changerOrdre = (nouvelOrdre) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('order', nouvelOrdre);

    navigate(`/annonces?${searchParams.toString()}`);
    setSortOrder(nouvelOrdre);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const searchParams = new URLSearchParams(location.search);
  const categorie = searchParams.get('categorie');

  let titre = "Toutes nos annonces";
  let description = "Découvrez toutes les annonces";

  if (categorie === 'evenements') {
    titre = "Nos événements";
    description = "Épaulée par sa famille, Laurence déborde d’énergie et de créativité. Elle organise au fil des saisons de nombreux événements conviviaux : journées portes ouvertes, petits-déjeuners à la ferme, activités pédagogiques pour enfants, journées de l’artisanat, projections de cinéma rural, et bien d'autres encore.";
  } else if (categorie === 'recettes') {
    titre = "Nos recettes";
    description = "Laurence vous accompagne en cuisine avec des recettes simples et accessibles à tous. L’occasion de redécouvrir les produits du magasin de la ferme autrement, avec des idées faciles à réaliser au quotidien. Légumes de saison, viande, fromages… une cuisine pleine de goût, à partager en famille ou entre amis.";
  }

  return (
    <div className="annonce-main">
      <div className="liste-annonces">
        <div className="infos-categorie flex-center">
          <h1>{titre}</h1>
          <p>{description}</p>
        </div>
        <div className="filtres-categories flex-center">

          <button
            className={sortOrder === 'desc' ? "filtre-actif" : ""}
            onClick={() => changerOrdre('desc')}
          >Plus récent</button>
          <button
            className={sortOrder === 'asc' ? "filtre-actif" : ""}
            onClick={() => changerOrdre('asc')}
          >Plus ancien</button>
          <span className="filtre-separateur"></span>

          <button
            className={!categorie ? "filtre-actif" : ""}
            onClick={() => filtrageCategorie(null)}
          >Toutes</button>
          <button
            className={categorie === 'evenements' ? "filtre-actif" : ""}
            onClick={() => filtrageCategorie('evenements')}
          >Événements</button>
          <button
            className={categorie === 'recettes' ? "filtre-actif" : ""}
            onClick={() => filtrageCategorie('recettes')}
          >Recettes</button>


        </div>

        {annonces.length === 0 ? (
          <p>Aucune annonce disponible pour le moment.</p>
        ) : (
          <AnnoncesGrid annonces={annonces} />
        )}
      </div>
    </div>
  );
};

export default ListeAnnonces;
