import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Data from '../../data/Data';
import './Tournaments.scss';

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await Data.getTournaments();
      setTournaments(data);
    };

    fetchTournaments();
  }, []);

  const openTournament = (id) => {
    navigate(`/tournament/${id}`);
  }

  return (
    <div className="Tournaments">
      <h1>Tournaments</h1>

      <div className="row row-box mb-3 mx-3" onClick={() => openTournament(5)}>
        <div className="col-10 col-md-4 fw-semibold">
          valami
        </div>
        <div className="col-md-4 d-none d-md-flex">
          2023.01.01
        </div>
        <div className="col-md-4 d-none d-md-flex">
          <button className="btn btn-primary btn-sm">Explore</button>
        </div>
      </div>
    </div>
  );
}

export default Tournaments;
