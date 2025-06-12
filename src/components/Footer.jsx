import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-section-logo">
          <div className="footer-logo flex-center">
            <Link to="/">
              <img src="/logo_vertical.svg" alt="Logo" />
            </Link>
          </div>
        </div>

        <div className="footer-section footer-section-about">
          <h3 className="footer-title">À propos</h3>
          <p><strong>Le magasin</strong> est ouvert les lundis, mercredis, jeudis et vendredis de 13h30 à 19h, ainsi que le samedi de 10h à 18h. Fermé le mardi et le dimanche.</p>
          <p><strong>La boucherie</strong> est ouverte du mercredi au vendredi de 13h30 à 19h, et le samedi de 10h à 18h.</p>
          <p><strong>Les paiements</strong> s’effectuent directement <strong>sur place</strong>, à la ferme. Nous acceptons les <strong>paiements en espèces</strong> et par <strong>carte bancaire.</strong></p>
        </div>

        <div className="footer-section footer-section-liens">
          <h3 className="footer-title">Liens rapides</h3>
          <ul className="footer-liens">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/Annonces">Nos Annonces</Link></li>
            <li><Link to="/notre-histoire">Notre histoire</Link></li>
            <li><Link to="/produits">Nos produits</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section footer-section-contact">
          <h3 className="footer-title">Contact</h3>
          <ul className="contact-list">
            <li>
              <span>
                <img src="/phone-icon.svg" alt="phone" />
                 Téléphone du magasin
              </span>
              <a href="tel:+32496313986">+32 0 496 31 39 86</a>
            </li>
            <li>
              <span>
                <img src="/phone-icon.svg" alt="phone" />
                Téléphone de la boucherie
              </span>
              <a href="tel:+32476032969">+32 0 476 03 29 69</a>
            </li>
            <li>
              <span>
                <img src="/mail-icon.svg" alt="mail" />
                Email
              </span>
              <a href="mailto:fermedelabossejauque@gmail.com">fermedelabossejauque@gmail.com</a>
            </li>
            <li>
              <span>
                <img src="/location-icon.svg" alt="location" />
                Adresse
              </span>
               <a href="https://www.google.com/maps?q=Chemin+de+Silly+11+-+7823+Gibecq" target="_blank" rel="noopener noreferrer">
                <address>Chemin de Silly 11 - 7823 Gibecq</address>
              </a>
            </li>
            <li>
              <span>
                <img src="/facebook-icon.svg" alt="facebook" />
                Facebook
              </span>
              <a href="https://www.facebook.com/p/Ferme-de-la-bosse-jauque-100064739531349/?locale=fr_FR" target="_blank" rel="noopener noreferrer">
                facebook.com/fermedelabossejauque
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright">
        <h3>© 2025 . La Ferme de la Bosse Jauque . Tous droits réservés.</h3>
      </div>
    </footer>
  );
};

export default Footer;
