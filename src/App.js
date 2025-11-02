import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.scss';
import Tournaments from './pages/Tournaments';
import Tournament from './pages/Tournament';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="App text-light">
      <AuthProvider>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Tournaments />} />
            <Route path="/tournament/:id" element={<Tournament />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
