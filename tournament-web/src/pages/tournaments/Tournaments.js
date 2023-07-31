import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Data from '../../data/Data';
import Modal from 'react-bootstrap/Modal';
import './Tournaments.scss';

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [showAddTournamentModal, setShowAddTournamentModal] = useState(false);
  const [inputParticipantsValue, setInputParticipantsValue] = useState('');
  const totalPromotedOptions = [2, 4, 8, 16, 32, 64];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await Data.getTournaments();
      setTournaments(data);
    };

    fetchTournaments();
  }, []);

  const handleInputParticipantsChange = (event) => {
    setInputParticipantsValue(event.target.value);
  };

  const openTournament = (id) => {
    navigate(`/tournament/${id}`);
  }

  const addTournament = () => {
    setShowAddTournamentModal(false);

    // mock
    let id = 5;
    navigate(`/tournament/${id}`);
  }

  const numbers = Array.from({ length: 62 }, (_, index) => index + 3);

  return (
    <div className="Tournaments container">
      <div className='row mb-3'>
        <div className='col-6'>
          <h1>Tournaments</h1>
        </div>
        <div className='col-6 d-flex justify-content-end align-items-center'>
          <div>
            <button className='btn btn-sm btn-success' onClick={() => setShowAddTournamentModal(true)}>Add tournament</button>
          </div>
        </div>
      </div>

      <div className="row row-box mb-4" onClick={() => openTournament(5)}>
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

      <div className="row row-box mb-4" onClick={() => openTournament(5)}>
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

      <Modal onHide={() => setShowAddTournamentModal(false)} show={showAddTournamentModal}>
        <Modal.Header closeButton style={{ border: 0 }}>
          <Modal.Title>Add tournament</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="inputTitle" className="form-label">Title</label>
              <input required type="email" className="form-control" id="inputTitle" name="usernameEmail" />
              <div className="invalid-feedback">Title is required</div>
            </div>

            <label htmlFor="inputParticipants" className="form-label">Participants</label>
            <select
              className="form-select mb-3"
              aria-label="Default select example"
              value={inputParticipantsValue}
              onChange={handleInputParticipantsChange}
            >
              <option value="" disabled>
                Select a number
              </option>
              {numbers.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>

            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
              <label className="form-check-label" for="flexSwitchCheckDefault">Round-robin</label>
            </div>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
              <label className="form-check-label" for="flexSwitchCheckDefault">Knockout</label>
            </div>

            <label htmlFor="inputTotalPromoted" className="form-label">Total Promoted</label>
            <select className="form-select mb-3" aria-label="Default select example">
              <option value="" disabled selected>
                Select a number
              </option>
              {totalPromotedOptions.filter((value) => value <= inputParticipantsValue).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <div className="row">
              <div className="col-5">
                <button className="btn btn-primary" onClick={() => addTournament()}>Create</button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Tournaments;
