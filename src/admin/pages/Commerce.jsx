import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CommerceAdmin.scss';
import API_BASE_URL from '../../config/api';

function Commerce() {
  const navigate = useNavigate();
  const [commerces, setCommerces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Formulaire, setFormulaire] = useState(false);
  const [CommerceActuel, setCommerceActuel] = useState(null);

  const [formData, setFormDonnees] = useState({
    titre: '',
    description: '',
    telephone: '',
    imageFile: null,
    imagePreview: null
  });

  useEffect(() => {
    Commerces();
  }, []);

  const Commerces = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/commerces`);
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        setCommerces(response.data);
      } else {
        console.error('La réponse de l\'API n\'est pas un tableau:', response.data);
        setCommerces([]);
        setError('Format de données incorrect reçu du serveur');
      }
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des commerces:', err);
      setError('Erreur lors du chargement des commerces');
      setCommerces([]); // S'assurer que commerces reste un tableau
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      handleFileChange(files[0]); 
    } else {
      setFormDonnees(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormDonnees(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditionCommerce = (commerce) => {
    setCommerceActuel(commerce);
    setFormDonnees({
      titre: commerce.titre,
      description: commerce.description,
      telephone: commerce.telephone || '',
      imageFile: null,
      imagePreview: commerce.imageUrl || null
    });
    setFormulaire(true);
  };

  const handleValidation = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = CommerceActuel?.imageUrl;

      if (formData.imageFile) {
        const formDataFile = new FormData();
        formDataFile.append('image', formData.imageFile);

        const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload/commerce/${CommerceActuel.id}`, formDataFile);
        imageUrl = uploadResponse.data.imageUrl;
      }

      const commerceData = {
        titre: formData.titre,
        description: formData.description,
        telephone: formData.telephone,
        imageUrl: imageUrl
      };

      await axios.put(`${API_BASE_URL}/api/commerces/${CommerceActuel.id}`, commerceData);

      Commerces();
      setFormulaire(false);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du commerce:', err);
      setError('Erreur lors de l\'enregistrement du commerce');
    }
  };

  const handleVueDetails = (id) => {
    navigate(`/adminfermebossejauque/Commerces/${id}`);
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="commerce-admin">
      <h1 className="page-title">Gestion des Commerces</h1>

      {error && <div className="error">{error}</div>}

      {Formulaire && (
        <div className="commerce-form-container">
          <form className="commerce-form" onSubmit={handleValidation}>
            <h2>Modifier le commerce</h2>

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
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
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
              />
              {formData.imagePreview && (
                <div className="image-preview">
                  <img src={formData.imagePreview} alt="Prévisualisation" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-sauver">
                Mettre à jour
              </button>
              <button type="button" className="btn-annuler" onClick={() => setFormulaire(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="commerces-list">
        <h2>Liste des commerces</h2>

        {!Array.isArray(commerces) || commerces.length === 0 ? (
          <p className="no-data">Aucun commerce trouvé.</p>
        ) : (
          <div className="commerces-grid">
            {commerces.map(commerce => (
              <div key={commerce.id} className="commerce-card">
                <div className="commerce-card-image">
                  {commerce.imageUrl && (
                    <img
                      src={commerce.imageUrl || '/assets/images/placeholder.jpg'}
                      alt={commerce.titre}
                      className="commerce-thumbnail"
                    />
                  )}
                </div>

                <div className="commerce-card-content">
                  <h3 className="commerce-title">{commerce.titre}</h3>
                  <p className="commerce-description">
                    {commerce.description && commerce.description.length > 100
                      ? `${commerce.description.substring(0, 100)}...`
                      : commerce.description}
                  </p>

                  <div className="commerce-meta">
                    <span className="meta-item">
                      <strong>Type:</strong> {commerce.type}
                    </span>
                    {commerce.telephone && (
                      <span className="meta-item">
                        <strong>Téléphone:</strong> {commerce.telephone}
                      </span>
                    )}
                    <span className="meta-item">
                      <strong>Date:</strong> {new Date(commerce.datecreation).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="commerce-card-actions">
                  <button onClick={() => handleVueDetails(commerce.id)} className="btn-view bouton1">
                    Détails
                  </button>
                  <button onClick={() => handleEditionCommerce(commerce)} className="btn-edition bouton2">
                    Modifier
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

export default Commerce;
