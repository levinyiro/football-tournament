import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Data from '../data/Data';
import CreateTournament from '../components/CreateTournament';

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [showAddTournamentModal, setShowAddTournamentModal] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    await Data.fetchTournaments();
    setTournaments(Data.tournaments);
  };

  const openTournament = (id) => {
    navigate(`/tournament/${id}`);
  }

  return (
    <div className="Tournaments container">
      <div className='row mb-3'>
        <div className='col-6'>
          <div className="d-flex align-items-center">
            <div className='d-inline'>
              <h1 className="mb-3">Tournaments</h1>
            </div>
          </div>
        </div>
        <div className='col-6 d-flex justify-content-end align-items-center'>
          {isLoggedIn && (<div>
            <button className='btn btn-sm btn-success' onClick={() => setShowAddTournamentModal(true)}>Add tournament</button>
          </div>)}
        </div>
      </div>

      <div>
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="row row-box mb-4" onClick={() => openTournament(tournament.id)}>
            <div className="col-10 col-md-4 fw-semibold">
              {tournament.title}
            </div>
            <div className="col-md-4 d-none d-md-flex">
              {(() => {
                const d = new Date(tournament.date);
                return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
              })()}
            </div>
            <div className="col-md-4 d-none d-md-flex">
              <button className="btn btn-primary btn-sm">Explore</button>
            </div>
          </div>
        ))}
      </div>

      <CreateTournament showAddTournamentModal={showAddTournamentModal} setShowAddTournamentModal={setShowAddTournamentModal} />
    </div>
  );
}

export default Tournaments;
