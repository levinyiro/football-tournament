import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.scss';
import Tournaments from './pages/tournaments/Tournaments';
import Tournament from './pages/tournament/Tournament';
import NotFound from './pages/NotFound';

function App() {
  return (
    // <div className="App">
    //     <div>hello</div>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tournaments />} />
        <Route path="/tournament/:id" element={<Tournament />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
