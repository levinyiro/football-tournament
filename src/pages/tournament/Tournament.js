import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Data from '../../data/Data';
import Modal from 'react-bootstrap/Modal';
import './Tournament.scss';

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
            <div className="tab-content mb-5">
              {tournament.groups && tournament.groups.map((group, index) => (
                <div key={index} className="container card p-5 mt-5">
                  <h3 style={{ fontWeight: 900 }}>{group.name}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Name</th>
                        <th>Team</th>
                        <th>MP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.players.map((player, playerIndex) => {
                        const rowClass = (group.isReady && playerIndex <= group.promoted) ? "green-row" : "";

                        return (
                          <tr key={playerIndex} className={rowClass}>
                            <td>{playerIndex + 1}</td>
                            <td>{player.name}</td>
                            <td>{player.team}</td>
                            <td>{player.matchPlayed}</td>
                            <td>{player.won}</td>
                            <td>{player.draw}</td>
                            <td>{player.lose}</td>
                            <td>{player.gf}</td>
                            <td>{player.ga}</td>
                            <td>{player.gd}</td>
                            <td style={{ fontWeight: 'bold' }}>{player.points}</td>
                            {isLoggedIn && (
                              <td>
                                <button className='btn btn-primary btn-sm' onClick={() => openPlayerModal(player.id)}>Modify</button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {actualTab === 'knockout' && (
            <div className="knockout-tab mb-5">
              {tournament.knockouts && tournament.knockouts.map((knockout, index) => (
                <div key={index}>
                  <h3 className='text-center mt-5 lead'>{knockout.name}</h3>
                  <div className={`container card mt-4 ${knockout.name === 'Third place' ? 'bronze' : ''} ${knockout.name === 'Final' ? 'gold' : ''}`}>
                    {knockout.matches.map((match, matchIndex) => (
                      <div key={matchIndex}>
                        {matchIndex !== 0 && <hr className='m-1' />}
                        <div className='row d-flex align-items-center p-3'>
                          <div className={`col-4 text-center team ${match.playerAId === match.winner ? 'winner' : ''}`}>
                            <h4>{match.playerA ? match.playerA.name : '?'}</h4>
                            {match.playerA && match.playerA.team && <p>{match.playerA.team}</p>}
                          </div>
                          <div className='col-1'></div>

                          {isLoggedIn ? (
                            <div className='col-2 py-2 row'>
                              <div className='col-4'>
                                <input type="text" id={`a;${match.id}`} defaultValue={match.scoreA} className='form-control text-center' onChange={e => modifyMatch(e.target)} />
                              </div>
                              <div className='col-4 d-flex justify-content-center align-items-center'></div>
                              <div className='col-4'>
                                <input type="text" id={`b;${match.id}`} defaultValue={match.scoreB} className='form-control text-center' onChange={e => modifyMatch(e.target)} />
                              </div>
                            </div>
                          ) : (
                            <div className='col-2 result py-2 text-center'>{match.scoreA} - {match.scoreB}</div>
                          )}

                          <div className='col-1'></div>
                          <div className={`col-4 text-center team ${match.playerBId === match.winner ? 'winner' : ''}`}>
                            <h4>{match.playerB ? match.playerB.name : '?'}</h4>
                            {match.playerB && match.playerB.team && <p>{match.playerB.team}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {actualTab === 'matches' && (
            <div className="matches-tab mb-5">
              {tournament.matches && tournament.matches.map((match, index) => (
                <div key={index}>
                  <h3 className='text-center mt-5 lead'>{match.name}</h3>
                  <div className="container card p-3 mt-4">
                    {match.matches.map((innerMatch, innerMatchIndex) => (
                      <div key={innerMatchIndex}>
                        {innerMatchIndex !== 0 && <hr className='m-1' />}
                        <div className='row d-flex align-items-center p-3'>
                          <div className={`col-4 text-center team ${innerMatch.playerAId === innerMatch.winner ? 'winner' : ''}`}>
                            <h4>{innerMatch.playerA ? innerMatch.playerA.name : '?'}</h4>
                            {innerMatch.playerA && innerMatch.playerA.team && <p>{innerMatch.playerA.team}</p>}
                          </div>
                          <div className='col-1'></div>
                          {isLoggedIn ? (
                            <div className='col-2 py-2 row'>
                              <div className='col-4'>
                                <input type="text" id={`a;${innerMatch.id}`} value={innerMatch.scoreA} className='form-control text-center' onChange={e => modifyMatch(e.target)} />
                              </div>
                              <div className='col-4 d-flex justify-content-center align-items-center'></div>
                              <div className='col-4'>
                                <input type="text" id={`b;${innerMatch.id}`} value={innerMatch.scoreB} className='form-control text-center' onChange={e => modifyMatch(e.target)} />
                              </div>
                            </div>
                          ) : (
                            <div className='col-2 result py-2 text-center'>{innerMatch.scoreA} - {innerMatch.scoreB}</div>
                          )}
                          <div className='col-1'></div>
                          <div className={`col-4 text-center team ${innerMatch.playerBId === innerMatch.winner ? 'winner' : ''}`}>
                            <h4>{innerMatch.playerB ? innerMatch.playerB.name : '?'}</h4>
                            {innerMatch.playerB && innerMatch.playerB.team && <p>{innerMatch.playerB.team}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
