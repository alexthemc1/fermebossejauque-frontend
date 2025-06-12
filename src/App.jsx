import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Annonce from './pages/Annonce';
import ListeAnnonces from './pages/Annonces';
import Histoire from './pages/Histoire';
import Produits from './pages/Produits';
import Magasin from './pages/Magasin';
import Boucherie from './pages/Boucherie';
import Contact from './pages/Contact';
import Admin from './admin/Admin';
import AdminLogin from './admin/AdminLogin';

function App() {
  const isAdminPage = window.location.pathname.startsWith('/adminfermebossejauque');
  const isAdminLoginPage = window.location.pathname.startsWith('/admin-login');

  return (
    <>
      {isAdminPage || isAdminLoginPage ? (
        <Routes>
          <Route path="/adminfermebossejauque/*" element={<Admin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/annonces" element={<ListeAnnonces />} />
              <Route path="/annonce/:id" element={<Annonce />} />
              <Route path="/notre-histoire" element={<Histoire />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/magasin" element={<Magasin />} />
              <Route path="/boucherie" element={<Boucherie />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
