import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOuvert, setMobileMenuOuvert] = useState(false);

  // Fermer le menu mobile sur redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOuvert(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const zoneMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const zoneMobileMenu = () => {
    setMobileMenuOuvert(!mobileMenuOuvert);
  };

  const handleCliqueExterieur = () => {
    if (activeMenu) {
      setActiveMenu(null);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-infos">
        <div className="infos flex-center">
          <ul className="infos-gauche">
            <li className="infos-item">
              <img src="/location-icon.svg" alt="location" />
              <p>Chemin de Silly 11 - 7823 Gibecq</p>
            </li>
            <li className="infos-item">
              <img src="/mail-icon.svg" alt="mail" />
               <a href="mailto:fermedelabossejauque@gmail.com">fermedelabossejauque@gmail.com</a>
            </li>
          </ul>
          <ul className="infos-droite">
            <li className="infos-item">
              <a href="https://www.facebook.com/p/Ferme-de-la-bosse-jauque-100064739531349/?locale=fr_FR" target="_blank" rel="noOuverter noreferrer" className="navbar-lien icon">
                <img src="/facebook-icon.svg" alt="Facebook" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-container" onClick={handleCliqueExterieur}>
        <div className="navbar-navigation">
          <Link to="/" className="navbar-logo">
            <img src="/logo_large.svg" alt="Logo" className="navbar-logo-img" />
          </Link>

          <button className="mobile-menu-zone" onClick={zoneMobileMenu}>
            <img src="/assets/images/menu-burger-ouvert.svg" alt="menu-burger-ouvert" />
          </button>

          <ul className={`navbar-menu ${mobileMenuOuvert ? 'mobile-active' : ''}`}>
            <button className="fermer-menu-btn" onClick={zoneMobileMenu}>
              <img src="/assets/images/menu-burger-fermer.svg" alt="menu-burger-fermer" />
            </button>
            <li className="navbar-item">
              <Link to="/" className="navbar-lien" onClick={() => setMobileMenuOuvert(false)}>Accueil</Link>
            </li>
            <li className="navbar-item menuderoulant">
              <div
                className="navbar-lien menuderoulant-zone flex-center"
                onClick={(e) => {
                  e.stopPropagation();
                  zoneMenu('annonces');
                }}
              >
                Annonces <span className="menuderoulant-fleche">▼</span>
              </div>
              {activeMenu === 'annonces' && (
                <ul className="menuderoulant-menu">
                  <li>
                    <Link to="/annonces" className="menuderoulant-lien" onClick={() => setMobileMenuOuvert(false)}>Toutes les annonces</Link>
                  </li>
                  <li>
                    <Link to="/annonces?categorie=evenements" className="menuderoulant-lien" onClick={() => setMobileMenuOuvert(false)}>Événements</Link>
                  </li>
                  <li>
                    <Link to="/annonces?categorie=recettes" className="menuderoulant-lien" onClick={() => setMobileMenuOuvert(false)}>Recettes</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="navbar-item">
              <Link to="/notre-histoire" className="navbar-lien" onClick={() => setMobileMenuOuvert(false)}>Notre histoire</Link>
            </li>
            <li className="navbar-item menuderoulant">
              <div
                className="navbar-lien menuderoulant-zone flex-center"
                onClick={(e) => {
                  e.stopPropagation();
                  zoneMenu('produits');
                }}
              >
                Nos Produits <span className="menuderoulant-fleche">▼</span>
              </div>
              {activeMenu === 'produits' && (
                <ul className="menuderoulant-menu">
                  <li>
                    <Link to="/produits" className="menuderoulant-lien" onClick={() => setMobileMenuOuvert(false)}>Nos produits</Link>
                  </li>
                  <li>
                    <Link to="/magasin" className="menuderoulant-lien" onClick={() => setMobileMenuOuvert(false)}>Magasin de la ferme</Link>
                  </li>
                  <li>
                    <Link to="/boucherie" className="menuderoulant-lien" onClick={() => setMobileMenuOuvert(false)}>Boucherie chez Paul</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="navbar-item">
              <Link to="/contact" className="navbar-lien" onClick={() => setMobileMenuOuvert(false)}>Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
