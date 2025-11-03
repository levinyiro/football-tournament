import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Data from '../data/Data';
import Group from '../components/Group';
import Knockout from '../components/Knockout';
import Matches from '../components/Matches';

function Tournament() {
  const { id } = useParams();
  const [actualTab, setActualTab] = useState('group');
  const [tournament, setTournament] = useState(null);
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

  return (
    <div className="Tournament">
      {tournament && (
        <div>
          {tournament.image ? (
            <div>
              <div className="tournament-hero" style={{backgroundImage: `url(../${tournament.image})`}}></div>
              <div className='hero-transform'></div>
            </div>
          ) : (<div style={{padding: '30px'}}></div>)}
          <div className="d-flex align-items-center container">
            <div className='d-inline'>
              <h1 className="mb-3">{tournament.title}</h1>
            </div>
            {isLoading && (
              <div className="spinner-border text-light d-inline ms-4 mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>

          <div className="d-flex mb-3 nav nav-pills container" role="tablist">
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
            <Group tournament={tournament} fetchTournament={fetchTournament} />
          )}

          {actualTab === 'knockout' && (
            <Knockout tournament={tournament} fetchTournament={fetchTournament} />
          )}

          {actualTab === 'matches' && (
            <Matches tournament={tournament} fetchTournament={fetchTournament} />
          )}
        </div>
      )}
    </div>
  );
}

export default Tournament;
