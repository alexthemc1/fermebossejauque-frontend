import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AnnonceDetail.scss';
import API_BASE_URL from '../../config/api';

function AnnonceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [sections, setSections] = useState([]);
  const [galerie, setGalerie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sections');

  // États pour le formulaire de section
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [sectionFormData, setSectionFormData] = useState({
    type: 'TITRE',
    contenu: '',
    imageFile: null,
    imagePreview: null,
    videoUrl: ''
  });

  // États pour le formulaire de galerie
  const [showGalerieForm, setShowGalerieForm] = useState(false);
  const [galerieFormData, setGalerieFormData] = useState({
    imageFile: null,
    imagePreview: null,
    description: ''
  });

  useEffect(() => {
    fetchAnnonceDetails();
  }, [id]);

  const fetchAnnonceDetails = async () => {
    try {
      setLoading(true);

      // Récupérer les détails de l'annonce
      const annonceResponse = await axios.get(`${ API_BASE_URL }/api/annonces/${id}`);
      setAnnonce(annonceResponse.data);

      // Récupérer les sections
      const sectionsResponse = await axios.get(`${ API_BASE_URL }/api/annonces/${id}/sections`);
      setSections(sectionsResponse.data);

      // Récupérer la galerie
      const galerieResponse = await axios.get(`${ API_BASE_URL }/api/annonces/${id}/galerie`);
      setGalerie(galerieResponse.data);

      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des détails de l\'annonce:', err);
      setError('Erreur lors du chargement des détails de l\'annonce');
      setLoading(false);
    }
  };

  // Gestion des sections
  const handleSectionChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSectionFormData({
          ...sectionFormData,
          imageFile: files[0],
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setSectionFormData({ ...sectionFormData, [name]: value });
    }
  };

  const handleNewSection = () => {
    setCurrentSection(null);
    setSectionFormData({
      type: 'TITRE',
      contenu: '',
      imageFile: null,
      imagePreview: null,
      videoUrl: ''
    });
    setShowSectionForm(true);
  };

  const handleEditSection = (section) => {
    setCurrentSection(section);
    setSectionFormData({
      type: section.type,
      contenu: section.contenu,
      imageFile: null,
      imagePreview: section.imageUrl || null,
      videoUrl: section.videoUrl || ''
    });
    setShowSectionForm(true);
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = currentSection?.imageUrl;

      // Si une nouvelle image a été sélectionnée, la télécharger dans le dossier de l'annonce
      if (sectionFormData.imageFile) {
        const formDataFile = new FormData();
        formDataFile.append('image', sectionFormData.imageFile);

        const uploadResponse = await axios.post(`${ API_BASE_URL }/api/upload/section/${id}`, formDataFile);
        imageUrl = uploadResponse.data.imageUrl;
      }

      const sectionData = {
        type: sectionFormData.type,
        contenu: sectionFormData.contenu || '',
        imageUrl: imageUrl,
        videoUrl: sectionFormData.videoUrl
      };

      if (currentSection) {
        // Mise à jour d'une section existante
        await axios.put(`${ API_BASE_URL }/api/sections/${currentSection.id}`, sectionData);
      } else {
        // Création d'une nouvelle section
        await axios.post(`${ API_BASE_URL }/api/annonces/${id}/sections`, sectionData);
      }

      // Rafraîchir les sections
      fetchAnnonceDetails();
      setShowSectionForm(false);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la section:', err);
      setError('Erreur lors de l\'enregistrement de la section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      try {
        await axios.delete(`${ API_BASE_URL }/api/sections/${sectionId}`);
        fetchAnnonceDetails();
      } catch (err) {
        console.error('Erreur lors de la suppression de la section:', err);
        setError('Erreur lors de la suppression de la section');
      }
    }
  };

  // Gestion de la galerie
  const handleGalerieChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalerieFormData({
          ...galerieFormData,
          imageFile: files[0],
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setGalerieFormData({ ...galerieFormData, [name]: value });
    }
  };

  const handleNewGalerieImage = () => {
    setGalerieFormData({
      imageFile: null,
      imagePreview: null,
      description: ''
    });
    setShowGalerieForm(true);
  };

  const handleGalerieSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!galerieFormData.imageFile) {
        setError('Veuillez sélectionner une image');
        return;
      }

      // Télécharger l'image dans le dossier de l'annonce
      const formDataFile = new FormData();
      formDataFile.append('image', galerieFormData.imageFile);

      const uploadResponse = await axios.post(`${ API_BASE_URL }/api/upload/galerie/${id}`, formDataFile);
      const imageUrl = uploadResponse.data.imageUrl;

      // Ajouter l'image à la galerie
      await axios.post(`${ API_BASE_URL }/api/annonces/${id}/galerie`, {
        imageUrl,
        description: galerieFormData.description
      });

      // Rafraîchir la galerie
      fetchAnnonceDetails();
      setShowGalerieForm(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'image à la galerie:', err);
      setError('Erreur lors de l\'ajout de l\'image à la galerie');
    }
  };

  const handleDeleteGalerieImage = async (imageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      try {
        await axios.delete(`${ API_BASE_URL }/api/galerie/${imageId}`);
        fetchAnnonceDetails();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'image:', err);
        setError('Erreur lors de la suppression de l\'image');
      }
    }
  };

  const handleBack = () => {
    navigate('/adminfermebossejauque/Annonces');
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!annonce) return <div className="error">Annonce non trouvée</div>;

  return (
    <div className="annonce-detail">
      <div className="annonce-header">
        <button className="btn-retour" onClick={handleBack}>
          Retour aux annonces
        </button>
        <h1>{annonce.titre}</h1>
      </div>

      <div className="annonce-info">
        <div className="annonce-image">
          <img src={annonce.imageUrl || '/assets/images/placeholder.jpg'} alt={annonce.titre} />
        </div>
        <div className="annonce-meta">
          <p><strong>Description:</strong> {annonce.description}</p>
          <p><strong>Catégorie:</strong> {annonce.categorie?.nom || 'Non catégorisé'}</p>
          <p><strong>Date de création:</strong> {new Date(annonce.datecreation).toLocaleDateString()}</p>
          <p><strong>Nouveau:</strong> {annonce.new ? 'Oui' : 'Non'}</p>
        </div>
      </div>

      <div className="annonce-tabs">
        <button
          className={activeTab === 'sections' ? 'active' : ''}
          onClick={() => setActiveTab('sections')}
        >
          Sections
        </button>
        <button
          className={activeTab === 'galerie' ? 'active' : ''}
          onClick={() => setActiveTab('galerie')}
        >
          Galerie
        </button>
      </div>

      {activeTab === 'sections' && (
        <div className="annonce-sections">
          <div className="section-header">
            <h2>Sections</h2>
            <button className="btn-ajout" onClick={handleNewSection}>
              Ajouter une section
            </button>
          </div>

          {showSectionForm && (
            <div className="section-form-container">
              <form className="section-form" onSubmit={handleSectionSubmit}>
                <h3>{currentSection ? 'Modifier la section' : 'Ajouter une section'}</h3>

                <div className="form-group">
                  <label htmlFor="type">Type de section</label>
                  <select
                    id="type"
                    name="type"
                    value={sectionFormData.type}
                    onChange={handleSectionChange}
                    required
                  >
                    <option value="TITRE">Titre</option>
                    <option value="PARAGRAPHE">Paragraphe</option>
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Vidéo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contenu">
                    {sectionFormData.type === 'IMAGE' || sectionFormData.type === 'VIDEO' 
                      ? 'Description (optionnelle)' 
                      : 'Contenu'}
                  </label>
                  <textarea
                    id="contenu"
                    name="contenu"
                    value={sectionFormData.contenu}
                    onChange={handleSectionChange}
                    required={sectionFormData.type !== 'IMAGE' && sectionFormData.type !== 'VIDEO'}
                  />
                </div>

                {sectionFormData.type === 'IMAGE' && (
                  <div className="form-group">
                    <label htmlFor="imageFile">Image</label>
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleSectionChange}
                    />
                    {sectionFormData.imagePreview && (
                      <div className="image-preview">
                        <img src={sectionFormData.imagePreview} alt="Prévisualisation" />
                      </div>
                    )}
                  </div>
                )}

                {sectionFormData.type === 'VIDEO' && (
                  <div className="form-group">
                    <label htmlFor="videoUrl">URL de la vidéo Youtube</label>
                    <input
                      type="text"
                      id="videoUrl"
                      name="videoUrl"
                      value={sectionFormData.videoUrl}
                      onChange={handleSectionChange}
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-sauver">
                    {currentSection ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                  <button type="button" className="btn-annuler" onClick={() => setShowSectionForm(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="sections-list">
            {sections.length === 0 ? (
              <p>Aucune section trouvée pour cette annonce.</p>
            ) : (
              sections.map((section, index) => (
                <div key={section.id} className="section-item">
                  <div className="section-order">{index + 1}</div>
                  <div className="section-content">
                    <div className="section-type">{section.type}</div>
                    <div className="section-text">
                      {section.type === 'IMAGE' && section.imageUrl && (
                        <img src={section.imageUrl || '/assets/images/placeholder.jpg'} alt="Section" />
                      )}
                      {section.type === 'VIDEO' && section.videoUrl && (
                        <div className="video-container">
                          <a href={section.videoUrl} target="_blank" rel="noopener noreferrer">
                            {section.videoUrl}
                          </a>
                        </div>
                      )}
                      <p>{section.contenu}</p>
                    </div>
                  </div>
                  <div className="section-actions">
                    <button onClick={() => handleEditSection(section)} className="btn-edition">
                      Modifier
                    </button>
                    <button onClick={() => handleDeleteSection(section.id)} className="btn-sup">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {activeTab === 'galerie' && (
        <div className="annonce-galerie">
          <div className="galerie-header">
            <h2>Galerie d'images</h2>
            <button className="btn-ajout" onClick={handleNewGalerieImage}>
              Ajouter une image
            </button>
          </div>

          {showGalerieForm && (
            <div className="galerie-form-container">
              <form className="galerie-form" onSubmit={handleGalerieSubmit}>
                <h3>Ajouter une image à la galerie</h3>

                <div className="form-group">
                  <label htmlFor="galerieImageFile">Image</label>
                  <input
                    type="file"
                    id="galerieImageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleGalerieChange}
                    required
                  />
                  {galerieFormData.imagePreview && (
                    <div className="image-preview">
                      <img src={galerieFormData.imagePreview} alt="Prévisualisation" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description (optionnelle)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={galerieFormData.description}
                    onChange={handleGalerieChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-sauver">
                    Ajouter
                  </button>
                  <button type="button" className="btn-annuler" onClick={() => setShowGalerieForm(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="galerie-grid">
            {galerie.length === 0 ? (
              <p>Aucune image dans la galerie.</p>
            ) : (
              galerie.map(image => (
                <div key={image.id} className="galerie-item">
                  <div className="galerie-image">
                    <img src={image.imageUrl || '/assets/images/placeholder.jpg'} alt={image.description || 'Image de galerie'} />
                  </div>
                  {image.description && (
                    <div className="galerie-description">
                      {image.description}
                    </div>
                  )}
                  <div className="galerie-actions">
                    <button onClick={() => handleDeleteGalerieImage(image.id)} className="btn-sup">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnonceDetail;
