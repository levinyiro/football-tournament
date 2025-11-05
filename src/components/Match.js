import Data from '../data/Data';
import { useAuth } from '../contexts/AuthContext';

function Match({ match, matchIndex, fetchTournament }) {
    const { isLoggedIn } = useAuth();
    
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
  <div key={match.id || matchIndex} className="match-container">
    {matchIndex !== 0 && <hr className="m-1" />}

    <div className="row d-flex align-items-center justify-content-center p-3 text-center g-2">
      <div
        className={`col-12 col-md-4 team ${match.playerAId === match.winner ? 'winner' : ''}`}
      >
        <h5 className="mb-0">{match.playerA?.name || '?'}</h5>
        {match.playerA?.team && <p className="text-muted small mb-0">{match.playerA.team}</p>}
      </div>

      <div className="col-12 col-md-3 my-2">
        {isLoggedIn ? (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <input
              type="text"
              id={`a;${match.id}`}
              value={match.scoreA}
              className="form-control text-center w-50"
              onChange={e => modifyMatch(e.target)}
            />
            <input
              type="text"
              id={`b;${match.id}`}
              value={match.scoreB}
              className="form-control text-center w-50"
              onChange={e => modifyMatch(e.target)}
            />
          </div>
        ) : (
          <div className="result fw-bold py-2">
            {match.scoreA} - {match.scoreB}
          </div>
        )}
      </div>

      <div
        className={`col-12 col-md-4 team ${match.playerBId === match.winner ? 'winner' : ''}`}
      >
        <h5 className="mb-0">{match.playerB?.name || '?'}</h5>
        {match.playerB?.team && <p className="text-muted small mb-0">{match.playerB.team}</p>}
      </div>
    </div>
  </div>
);
}

export default Match;