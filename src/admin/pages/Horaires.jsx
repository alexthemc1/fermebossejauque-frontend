import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/HoraireAdmin.scss';
import API_BASE_URL from '../../config/api';

function Horaires() {
  const [horaires, setHoraires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditionId] = useState(null);
  
  const joursSemaine = [
    "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"
  ];
  
  const [NouveauHoraire, setNouveauHoraire] = useState({
    jour: 'Lundi',
    ouverture: '',
    fermeture: '',
    status: true,
    typecommerce: 'MAGASIN'
  });
  
  const [editHoraire, editionHoraire] = useState({
    jour: '',
    ouverture: '',
    fermeture: '',
    status: true,
    typecommerce: 'MAGASIN'
  });

  const formatTimeToDisplay = (time) => {
    if (!time) return '';
    return time.replace(':', 'h');
  };

  const formatTimeForInput = (time) => {
    if (!time) return '';
    return time.replace('h', ':');
  };

  useEffect(() => {
    fetchHoraires();
  }, []);

  const fetchHoraires = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/horaires`);
      setHoraires(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des horaires:', err);
      setError('Impossible de charger les horaires. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleAjoutHoraire = async (e) => {
    e.preventDefault();
    try {
      const horaireEnvoyer = { ...NouveauHoraire };
      
      if (!horaireEnvoyer.status) {
        horaireEnvoyer.ouverture = "00h00";
        horaireEnvoyer.fermeture = "00h00";
      }
      
      await axios.post(`${API_BASE_URL}/api/horaires`, horaireEnvoyer);
      
      setNouveauHoraire({
        jour: 'Lundi',
        ouverture: '',
        fermeture: '',
        status: true,
        typecommerce: 'MAGASIN'
      });
      
      fetchHoraires();
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'horaire:', err);
      setError('Impossible d\'ajouter l\'horaire. Veuillez réessayer.');
    }
  };

  const handleEditionClick = (horaire) => {
    setEditionId(horaire.id);
    editionHoraire({
      jour: horaire.jour,
      ouverture: formatTimeForInput(horaire.ouverture),
      fermeture: formatTimeForInput(horaire.fermeture),
      status: horaire.status,
      typecommerce: horaire.typecommerce
    });
  };

  const handleModifierHoraire = async (e) => {
    e.preventDefault();
    try {
      const horaireModifier = {
        ...editHoraire,
        ouverture: editHoraire.status ? formatTimeToDisplay(editHoraire.ouverture) : '',
        fermeture: editHoraire.status ? formatTimeToDisplay(editHoraire.fermeture) : ''
      };
      
      await axios.put(`${ API_BASE_URL }/api/horaires/${editId}`, horaireModifier);
      setEditionId(null);
      fetchHoraires();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'horaire:', err);
      setError('Impossible de mettre à jour l\'horaire. Veuillez réessayer.');
    }
  };

  const handleSupprimerHoraire = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
      try {
        await axios.delete(`${ API_BASE_URL }/api/horaires/${id}`);
        fetchHoraires();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'horaire:', err);
        setError('Impossible de supprimer l\'horaire. Veuillez réessayer.');
      }
    }
  };

  const handleAnnulerEdit = () => {
    setEditionId(null);
  };

  const getHorairesTries = () => {
    const horairesTries = [...horaires];
    
    return horairesTries.sort((a, b) => {
      if (a.typecommerce !== b.typecommerce) {
        return a.typecommerce === 'MAGASIN' ? -1 : 1;
      }
      
      return joursSemaine.indexOf(a.jour) - joursSemaine.indexOf(b.jour);
    });
  };

  if (loading) return <div>Chargement des horaires...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const horairesTries = getHorairesTries();

  return (
    <div className="horaires-admin">
      <h1>Gestion des Horaires</h1>
      
      <div className="ajout-horaire-form">
        <h2>Ajouter un nouvel horaire</h2>
        <form onSubmit={handleAjoutHoraire}>
          <div className="form-group">
            <label>Jour:</label>
            <select 
              value={NouveauHoraire.jour} 
              onChange={(e) => setNouveauHoraire({...NouveauHoraire, jour: e.target.value})}
              required
            >
              {joursSemaine.map(jour => (
                <option key={jour} value={jour}>{jour}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Statut:</label>
            <select 
              value={NouveauHoraire.status ? "true" : "false"} 
              onChange={(e) => setNouveauHoraire({...NouveauHoraire, status: e.target.value === "true"})}
            >
              <option value="true">Ouvert</option>
              <option value="false">Fermé</option>
            </select>
          </div>
          <div className="form-group">
            <label>Heure d'ouverture:</label>
            <input 
              type="time" 
              value={NouveauHoraire.ouverture} 
              onChange={(e) => setNouveauHoraire({...NouveauHoraire, ouverture: e.target.value})}
              required={NouveauHoraire.status}
              disabled={!NouveauHoraire.status}
            />
          </div>
          <div className="form-group">
            <label>Heure de fermeture:</label>
            <input 
              type="time" 
              value={NouveauHoraire.fermeture} 
              onChange={(e) => setNouveauHoraire({...NouveauHoraire, fermeture: e.target.value})}
              required={NouveauHoraire.status}
              disabled={!NouveauHoraire.status}
            />
          </div>
          <div className="form-group">
            <label>Type de commerce:</label>
            <select 
              value={NouveauHoraire.typecommerce} 
              onChange={(e) => setNouveauHoraire({...NouveauHoraire, typecommerce: e.target.value})}
            >
              <option value="MAGASIN">Magasin</option>
              <option value="BOUCHERIE">Boucherie</option>
            </select>
          </div>
          <button type="submit" className="ajout-button">Ajouter l'horaire</button>
        </form>
      </div>
      
      <table className="horaires-table">
        <thead>
          <tr>
            <th>Jour</th>
            <th>Statut</th>
            <th>Ouverture</th>
            <th>Fermeture</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {horairesTries.map(horaire => (
            <tr key={horaire.id}>
              {editId === horaire.id ? (
                <>
                  <td>
                    <select
                      value={editHoraire.jour} 
                      onChange={(e) => editionHoraire({...editHoraire, jour: e.target.value})}
                    >
                      {joursSemaine.map(jour => (
                        <option key={jour} value={jour}>{jour}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select 
                      value={editHoraire.status ? "true" : "false"} 
                      onChange={(e) => editionHoraire({...editHoraire, status: e.target.value === "true"})}
                    >
                      <option value="true">Ouvert</option>
                      <option value="false">Fermé</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="time" 
                      value={editHoraire.ouverture} 
                      onChange={(e) => editionHoraire({...editHoraire, ouverture: e.target.value})}
                      disabled={!editHoraire.status}
                    />
                  </td>
                  <td>
                    <input 
                      type="time" 
                      value={editHoraire.fermeture} 
                      onChange={(e) => editionHoraire({...editHoraire, fermeture: e.target.value})}
                      disabled={!editHoraire.status}
                    />
                  </td>
                  <td>
                    <select 
                      value={editHoraire.typecommerce} 
                      onChange={(e) => editionHoraire({...editHoraire, typecommerce: e.target.value})}
                    >
                      <option value="MAGASIN">Magasin</option>
                      <option value="BOUCHERIE">Boucherie</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleModifierHoraire} className="sauver-button">Enregistrer</button>
                    <button onClick={handleAnnulerEdit} className="annuler-button">Annuler</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{horaire.jour}</td>
                  <td>{horaire.status ? 'Ouvert' : 'Fermé'}</td>
                  <td>{horaire.status ? horaire.ouverture : '-'}</td>
                  <td>{horaire.status ? horaire.fermeture : '-'}</td>
                  <td>{horaire.typecommerce === 'MAGASIN' ? 'Magasin' : 'Boucherie'}</td>
                  <td>
                    <button onClick={() => handleEditionClick(horaire)} className="edition-button">Modifier</button>
                    <button onClick={() => handleSupprimerHoraire(horaire.id)} className="supprimer-button">Supprimer</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Horaires;
