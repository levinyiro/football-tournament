import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Data from '../../data/Data';
import Modal from 'react-bootstrap/Modal';
import './Tournament.scss';
import Group from '../../components/Group';
import Knockout from '../../components/Knockout';
import Matches from '../../components/Matches';

function Tournament() {
  const { id } = useParams();
  const [actualTab, setActualTab] = useState('group');
  const [tournament, setTournament] = useState(null);
  const { isLoggedIn } = useAuth();
  const [actualPlayerModify, setActualPlayerModify] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerTeam, setPlayerTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTournament = useCallback(async () => {
    setIsLoading(true);
    await Data.fetchTournaments();
    const data = await Data.getTournament(id);
    if (data.groups === undefined) setActualTab('knockout');
    setTournament(data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  const openPlayerModal = async (playerId) => {
    setActualPlayerModify(playerId);
    const player = tournament.players.find(x => x.id === playerId);
    setPlayerName(player.name);
    setPlayerTeam(player.team);
  }

  const closePlayerModal = () => {
    setActualPlayerModify(null);
    setPlayerName('');
    setPlayerTeam('');
  }

  const handlePlayerModify = async (e) => {
    e.preventDefault();
    await Data.updatePlayer({ id: actualPlayerModify, name: playerName, team: playerTeam });
    fetchTournament();
    closePlayerModal();
  }

  const modifyMatch = async (e) => {
    e.value = e.value.replace(/\D/g, '');
    if (e.value < 0)
      e.value = 0;
    if (e.value > 99)
      e.value = e.value.substring(0, 2);

    const splittedId = e.id.split(';');
    await Data.updateMatch(splittedId[1], splittedId[0], e.value);
    fetchTournament();

    e.parentElement.classList.add('saved-match');
    setTimeout(() => {
      e.parentElement.classList.remove('saved-match');
    }, 2000);
  }

  return (
    <div className="Tournament container">
      {tournament && (
        <div>
          <div className="d-flex align-items-center">
            <div className='d-inline'>
              <h1 className="mb-3">{tournament.title}</h1>
            </div>
            {isLoading && (
              <div className="spinner-border text-light d-inline ms-4 mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>

          <div className="d-flex mb-3 nav nav-pills" role="tablist">
            {tournament.groups !== undefined && (
              <button
                className={`nav-link tournament-nav-link ${actualTab === 'group' ? 'active' : ''} me-2`}
                aria-current="page"
                onClick={() => setActualTab('group')}
              >
                Group
              </button>
            )}
            {tournament.knockouts !== undefined && (
              <button
                className={`nav-link tournament-nav-link ${actualTab === 'knockout' ? 'active' : ''} me-2`}
                onClick={() => setActualTab('knockout')}
              >
                Knockout
              </button>
            )}
            <button
              className={`nav-link tournament-nav-link ${actualTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActualTab('matches')}
            >
              Matches
            </button>
          </div>


          {actualTab === 'group' && (
            <Group tournament={tournament} isLoggedIn={isLoggedIn} openPlayerModal={openPlayerModal} />
          )}

          {actualTab === 'knockout' && (
            <Knockout tournament={tournament} isLoggedIn={isLoggedIn} modifyMatch={modifyMatch} />
          )}

          {actualTab === 'matches' && (
            <Matches tournament={tournament} isLoggedIn={isLoggedIn} modifyMatch={modifyMatch} />
          )}
        </div>
      )}

      <Modal onHide={() => closePlayerModal()} show={actualPlayerModify}>
        <Modal.Header closeButton style={{ border: 0 }}>
          <Modal.Title>
            Modify {actualPlayerModify && tournament.players.find(x => x.id === actualPlayerModify).name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePlayerModify}>
            <div className="mb-3">
              <label htmlFor="inputPlayerName" className="form-label">Name</label>
              <input required type="text" className="form-control" id="inputPlayerName" name="playerName" value={playerName} onChange={e => setPlayerName(e.target.value)} />
              <div className="invalid-feedback">Name is required</div>
            </div>

            <div className="mb-3">
              <label htmlFor="inputPlayerTeam" className="form-label">Team</label>
              <input type="text" className="form-control" id="inputPlayerTeam" name="playerTeam" value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} />
            </div>

            <div className="row">
              <div className="col-5">
                <button className="btn btn-primary">Modify</button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Tournament;
