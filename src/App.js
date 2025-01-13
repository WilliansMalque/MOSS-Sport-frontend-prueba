import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Importa la página de inicio
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RegisterPage from './pages/RegisterPage';
import TournamentListPage from './pages/TournamentListPage'; // Importa la nueva página
import Estadisticas from './pages/Estadisticas';

//prueba
import TestPage from './pages/TestPage';
import TestPage2 from './pages/TestPage2';
import RegisterPageUser from './pages/RegisterPageUser';
import SeleccionarTorneosYCategorias from './pages/SeleccionarTorneosYCategorias';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/test2" element={<TestPage2 />} />


        <Route path="/" element={<HomePage />} /> {/* Página de inicio */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerUser" element={<RegisterPageUser />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/torneos" element={<TournamentListPage />} /> 
        <Route path="dashboard" element={<Estadisticas />} />
        <Route path="/seleccionar-torneos-y-categorias" element={<SeleccionarTorneosYCategorias />} />
      </Routes>
    </Router>
  );
};

export default App;
