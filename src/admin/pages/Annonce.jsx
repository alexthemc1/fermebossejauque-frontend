import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AnnonceAdmin.scss';
import API_BASE_URL from '../../config/api';

function Annonce() {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Formulaire, setFormulaire] = useState(false);
  const [AnnonceActuel, setAnnonceActuel] = useState(null);
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    imageFile: null,
    imagePreview: null,
    categorieId: '',
    new: true,
    tempImagePath: null
  });

  useEffect(() => {
    Annonces();
    Categories();
  }, []);

  const Annonces = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/annonces`);
      if (Array.isArray(response.data)) {
        setAnnonces(response.data);
      } else {
        console.error('La réponse de l\'API n\'est pas un tableau:', response.data);
        setAnnonces([]);
        setError('Format de données incorrect reçu du serveur');
      }
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des annonces:', err);
      setError('Erreur lors du chargement des annonces');
      setAnnonces([]);
      setLoading(false);
    }
  };

  const Categories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('La réponse des catégories n\'est pas un tableau:', response.data);
        setCategories([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError('Erreur lors du chargement des catégories');
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: files[0],
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(files[0]);
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNouvelleAnnonce = () => {
    setAnnonceActuel(null);
    setFormData({
      titre: '',
      description: '',
      imageFile: null,
      imagePreview: null,
      categorieId: '',
      new: true,
      tempImagePath: null
    });
    setFormulaire(true);
  };

  const handleEditionAnnonce = (annonce) => {
    setAnnonceActuel(annonce);
    setFormData({
      titre: annonce.titre,
      description: annonce.description,
      imageFile: null,
      imagePreview: annonce.imageUrl || null,
      categorieId: annonce.categorieId || '',
      new: annonce.new,
      tempImagePath: null
    });
    setFormulaire(true);
  };

  const handleValidation = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = AnnonceActuel?.imageUrl;
      let tempImagePath = null;
      
      if (formData.imageFile) {
        const formDonneeFichier = new FormData();
        formDonneeFichier.append('image', formData.imageFile);
        
        if (AnnonceActuel) {
          const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload/annonce/${AnnonceActuel.id}`, formDonneeFichier);
          imageUrl = uploadResponse.data.imageUrl;
        } else {
          const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload/temp`, formDonneeFichier);
          imageUrl = uploadResponse.data.imageUrl;
          tempImagePath = uploadResponse.data.tempPath;
        }
      }
      
      const annonceData = {
        titre: formData.titre,
        description: formData.description,
        imageUrl: imageUrl,
        categorieId: formData.categorieId || null,
        new: formData.new,
        tempImagePath: tempImagePath
      };
      
      if (AnnonceActuel) {
        await axios.put(`${API_BASE_URL}/api/annonces/${AnnonceActuel.id}`, annonceData);
      } else {
        await axios.post(`${API_BASE_URL}/api/annonces`, annonceData);
      }
      
      Annonces();
      setFormulaire(false);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'annonce:', err);
      setError('Erreur lors de l\'enregistrement de l\'annonce');
    }
  };

  const handleSupressionAnnonce = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Toutes les images associées seront également supprimées.')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/annonces/${id}`);
        Annonces();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'annonce:', err);
        setError('Erreur lors de la suppression de l\'annonce');
      }
    }
  };

  const handleVueDetails = (id) => {
    navigate(`/adminfermebossejauque/Annonces/${id}`);
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="annonce-admin">
      <h1 className="page-title">Gestion des Annonces</h1>
      
      {error && <div className="error">{error}</div>}
      
      <button className="btn-ajout" onClick={handleNouvelleAnnonce}>
        Ajouter une annonce
      </button>
      
      {Formulaire && (
        <div className="annonce-form-container">
          <form className="annonce-form" onSubmit={handleValidation}>
            <h2>{AnnonceActuel ? 'Modifier l\'annonce' : 'Ajouter une annonce'}</h2>
            
            <div className="form-group">
              <label htmlFor="titre">Titre</label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="imageFile">Image principale</label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                required={!AnnonceActuel}
              />
              {formData.imagePreview && (
                <div className="image-preview">
                  <img src={formData.imagePreview} alt="Prévisualisation" />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="categorieId">Catégorie</label>
              <select
                id="categorieId"
                name="categorieId"
                value={formData.categorieId}
                onChange={handleChange}
              >
                <option value="">Sélectionner une catégorie</option>
                {Array.isArray(categories) && categories.map(categorie => (
                  <option key={categorie.id} value={categorie.id}>
                    {categorie.nom}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="new"
                name="new"
                checked={formData.new}
                onChange={handleChange}
              />
              <label htmlFor="new">Marquer comme nouveau</label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-sauver">
                {AnnonceActuel ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button type="button" className="btn-annuler" onClick={() => setFormulaire(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="annonces-list">
        <h2>Liste des annonces</h2>
        
        {!Array.isArray(annonces) || annonces.length === 0 ? (
          <p className="no-data">Aucune annonce trouvée.</p>
        ) : (
          <div className="annonces-grid">
            {annonces.map(annonce => (
              <div key={annonce.id} className="annonce-card">
                <div className="annonce-card-image">
                  {annonce.imageUrl && (
                    <img 
                      src={annonce.imageUrl || '/assets/images/placeholder.jpg'}
                      alt={annonce.titre}
                      className="annonce-thumbnail"
                    />
                  )}
                </div>
                
                <div className="annonce-card-content">
                  <h3 className="annonce-title">{annonce.titre}</h3>
                  <p className="annonce-description">
                    {annonce.description && annonce.description.length > 100 
                      ? `${annonce.description.substring(0, 100)}...` 
                      : annonce.description}
                  </p>
                  
                  <div className="annonce-meta">
                    <span className="meta-item">
                      <strong>Catégorie:</strong> {annonce.categorie?.nom || 'Non catégorisé'}
                    </span>
                    <span className="meta-item">
                      <strong>Date:</strong> {new Date(annonce.datecreation).toLocaleDateString()}
                    </span>
                    <span className={`meta-item status ${annonce.new ? 'new' : ''}`}>
                      {annonce.new ? 'Nouveau' : 'Ancien'}
                    </span>
                  </div>
                </div>
                
                <div className="annonce-card-actions">
                  <button onClick={() => handleVueDetails(annonce.id)} className="btn-view bouton1">
                    Détails
                  </button>
                  <button onClick={() => handleEditionAnnonce(annonce)} className="btn-edition bouton2">
                    Modifier
                  </button>
                  <button onClick={() => handleSupressionAnnonce(annonce.id)} className="btn-sup">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Annonce;
