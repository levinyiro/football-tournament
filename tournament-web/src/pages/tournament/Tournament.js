import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Data from '../../data/Data';
import './Tournament.scss';

function Tournament() {
  const { id } = useParams();
  const [actualTab, setActualTab] = useState('group');
  const [tournament, setTournament] = useState(null);
  const [groups, setGroups] = useState(null);
  const [matches, setMatches] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    fetchTournament();
  }, []);

  const fetchTournament = async () => {
    const data = await Data.getTournament(id);
    setTournament(data);

    if (data.groups == null)
      setActualTab('knockout');
    else {
      const groups = await Data.getGroups(id);
      setGroups(groups);
    }

    const matches = await Data.getMatches(id);
    setMatches(matches);
  };

  return (
    <div className="Tournament container">
      {tournament && (
        <div>
          <h1 className="mb-3">{tournament.title}</h1>

          <ul className="nav nav-pills mb-3">
            {tournament.groups !== null && (<li className="nav-item">
              <a className={`nav-link tournament-nav-link ${actualTab === 'group' ? 'active' : ''}`} aria-current="page" onClick={() => setActualTab('group')}>
                Group
              </a>
            </li>)}
            {tournament.knockouts !== null && (<li className="nav-item">
              <a className={`nav-link tournament-nav-link ${actualTab === 'knockout' ? 'active' : ''}`} onClick={() => setActualTab('knockout')}>
                Knockout
              </a>
            </li>)}
            <li className="nav-item">
              <a className={`nav-link tournament-nav-link ${actualTab === 'matches' ? 'active' : ''}`} onClick={() => setActualTab('matches')}>
                Matches
              </a>
            </li>
          </ul>

          {actualTab === 'group' && (
            <div className="tab-content mb-5">
              {groups && groups.map((group, index) => (
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
                        const rowClass = (group.isReady && playerIndex < 2) ? "green-row" : "";

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
              <h3 className='text-center mt-5 lead'>Semi-final</h3>
              <div className="container card mt-4">
                <div className='row d-flex align-items-center p-3'>
                  <div className='col-4 text-center team winner'>
                    <h4>Levi</h4>
                    <p>Manchester City</p>
                  </div>
                  <div className='col-1'></div>
                  <div className='col-2 result py-2 text-center'>4 - 3</div>
                  <div className='col-1'></div>
                  <div className='col-4 text-center team'>
                    <h4>Kapocsi</h4>
                    <p>Paris Saint-Germain</p>
                  </div>
                </div>

                <hr className='m-1' />

                <div className='row d-flex align-items-center p-3'>
                  <div className='col-4 text-center team'>
                    <h4>Zsombor</h4>
                    <p>Manchester United</p>
                  </div>
                  <div className='col-1'></div>
                  <div className='col-2 result py-2 text-center'>0 - 1</div>
                  <div className='col-1'></div>
                  <div className='col-4 text-center team winner'>
                    <h4>Lancz</h4>
                    <p>AC Milan</p>
                  </div>
                </div>
              </div>

              <h3 className='text-center lead mt-5'>Third place</h3>
              <div className="container card p-3 mt-4 bronze">
                <div className='row d-flex align-items-center'>
                  <div className='col-4 text-center team winner'>
                    <h4>Kapocsi</h4>
                    <p>Paris Saint-Germain</p>
                  </div>
                  <div className='col-1'></div>
                  <div className='col-2 result py-2 text-center'>1 - 0</div>
                  <div className='col-1'></div>
                  <div className='col-4 text-center team'>
                    <h4>Zsombor</h4>
                    <p>Manchester United</p>
                  </div>
                </div>
              </div>

              <h3 className='text-center mt-5 lead'>Play-off</h3>
              <div className="container card p-3 mt-4 gold">
                <div className='row d-flex align-items-center'>
                  <div className='col-4 text-center team winner row'>
                    <div className='col-2 mt-3'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-trophy" viewBox="0 0 16 16">
                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM3.504 1c.007.517.026 1.006.056 1.469.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.501.501 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667.03-.463.049-.952.056-1.469H3.504z" />
                      </svg>
                    </div>
                    <div className='col-10'>
                      <div>
                        <h4>Levi</h4>
                        <p>Manchester City</p>
                      </div>
                    </div>
                  </div>
                  <div className='col-1'></div>
                  <div className='col-2 result py-2 text-center'>2 - 1</div>
                  <div className='col-1'></div>
                  <div className='col-4 text-center team'>
                    <h4>Lancz</h4>
                    <p>AC Milan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {actualTab === 'matches' && (
            <div className="matches-tab mt-5">
              {matches && matches.map((match, index) => (
                <div key={index} className="container card p-3 mb-5">
                  <div className='row d-flex align-items-center'>
                    <div className={`col-4 text-center team ${match.playerAId === match.winner ? 'winner' : ''}`}>
                      <h4>{match.playerA ? match.playerA.name : '?'}</h4>
                      {match.playerA && match.playerA.team && <p>{match.playerA.team}</p>}
                    </div>
                    <div className='col-1'></div>
                    <div className='col-2 result py-2 text-center'>{match.scoreA} - {match.scoreB}</div>
                    <div className='col-1'></div>
                    <div className={`col-4 text-center team ${match.playerBId === match.winner ? 'winner' : ''}`}>
                      <h4>{match.playerB ? match.playerB.name : '?'}</h4>
                      {match.playerB && match.playerB.team && <p>{match.playerB.team}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Tournament;
