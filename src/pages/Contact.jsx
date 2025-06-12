import Horaire from '../components/Horaire';
import '../styles/contact.scss';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-titre">Contactez-nous</h1>

      <div className="contact-grid">
        <div className="contact-section">
          <Horaire type="ALL" />
        </div>

        <div className="contact-section">
          <h2>Nous trouver</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d158.1338168432191!2d3.9066248553532574!3d50.64307117190098!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3adcf1c615341%3A0x2610dbea764475a0!2sFerme%20d&#39;hont%20Baillez%20Vincent%20et%20Laurence!5e0!3m2!1sfr!2sbe!4v1746612455499!5m2!1sfr!2sbe"
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="eager"
            title="Google Maps - Ferme Bosse Jauque"
          ></iframe>
        </div>

        <div className="contact-section">
          <h2>Coordonnées</h2>
          <ul className="contact-list">
            <li>
              <span>
                <img src="/phone-icon.svg" alt="phone" />
                Téléphone du magasin :
              </span>
              <a href="tel:+32496313986">+32 496 31 39 86</a>
            </li>
            <li>
              <span>
                <img src="/phone-icon.svg" alt="phone" />
                Téléphone de la boucherie :
              </span>
              <a href="tel:+32476032969">+32 476 03 29 69</a>
            </li>
            <li>
              <span>
                <img src="/mail-icon.svg" alt="mail" />
                Email :
              </span>
              <a href="mailto:fermedelabossejauque@gmail.com">fermedelabossejauque@gmail.com</a>
            </li>
            <li>
              <span>
                <img src="/location-icon.svg" alt="location" />
                Adresse :
              </span>
              <a href="https://www.google.com/maps?q=Chemin+de+Silly+11+-+7823+Gibecq" target="_blank" rel="noopener noreferrer">
                <address>Chemin de Silly 11 - 7823 Gibecq</address>
              </a>
            </li>
            <li>
              <span>
                <img src="/facebook-icon.svg" alt="facebook" />
                Facebook :
              </span>
              <a href="https://www.facebook.com/p/Ferme-de-la-bosse-jauque-100064739531349/?locale=fr_FR" target="_blank" rel="noopener noreferrer">
                facebook.com/fermedelabossejauque
              </a>
            </li>
          </ul>
        </div>

        <div className="contact-section paiement-info">
          <h2>Modalités de paiement</h2>
          <p>
            Tous les paiements doivent être effectués <strong>sur place</strong>, directement à la ferme. Nous acceptons les paiements en <strong>espèces</strong> et par <strong>carte bancaire.</strong>
          </p>
          <p>
            Veuillez noter que <strong>nos prix peuvent varier</strong> selon les saisons et la disponibilité des produits. Cette variation reflète notre engagement envers des produits frais et de saison, cultivés dans le respect des cycles naturels.
          </p>
          <p>
            N'hésitez pas à nous contacter pour connaître les produits disponibles et leurs prix actuels avant votre visite.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
