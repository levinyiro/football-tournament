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
  const [knockouts, setKnockouts] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    fetchTournament();
  }, []);

  const fetchTournament = async () => {
    const data = await Data.getTournament(id);
    setTournament(data);

    // when I change tab - refresh it

    if (data.groups == null)
      setActualTab('knockout');

    if (data.groups) {
      const groups = await Data.getGroups(id);
      setGroups(groups);
    }

    if (data.knockouts) {
      const knockouts = await Data.getKnockouts(id);
      setKnockouts(knockouts);
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
              {tournament.knockouts.map((knockout, index) => (
                <div key={index}>
                  <h3 className='text-center mt-5 lead'>{knockout.name}</h3>
                  <div className={`container card mt-4 ${knockout.name === 'Third place' ? 'bronze' : ''} ${knockout.name === 'Play-off' ? 'gold' : ''}`}>
                    {knockout.matches.map((match, matchIndex) => (
                      <div key={matchIndex}>
                        {matchIndex !== 0 && <hr className='m-1' />}
                        <div className='row d-flex align-items-center p-3'>
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
                </div>
              ))}
            </div>
          )}

          {actualTab === 'matches' && (
            <div className="matches-tab mb-5">
              {matches && matches.map((match, index) => (
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
                          <div className='col-2 result py-2 text-center'>{innerMatch.scoreA} - {innerMatch.scoreB}</div>
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
    </div>
  );
}

export default Tournament;
