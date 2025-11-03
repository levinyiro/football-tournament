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
        <div key={match.id || matchIndex}>
            {matchIndex !== 0 && <hr className='m-1' />}
            <div className='row d-flex align-items-center p-3'>
                <div className={`col-4 text-center team ${match.playerAId === match.winner ? 'winner' : ''}`}>
                    <h4>{match.playerA?.name || '?'}</h4>
                    {match.playerA?.team && <p>{match.playerA.team}</p>}
                </div>
                <div className='d-none d-sm-block col-sm-1'></div>
                {isLoggedIn ? (
                    <div className='col-2 py-2 row'>
                        <div className='col-4'>
                            <input type="text" id={`a;${match.id}`} value={match.scoreA} className='form-control text-center' onChange={e => modifyMatch(e.target)} />
                        </div>
                        <div className='col-4 d-flex justify-content-center align-items-center'></div>
                        <div className='col-4'>
                            <input type="text" id={`b;${match.id}`} value={match.scoreB} className='form-control text-center' onChange={e => modifyMatch(e.target)} />
                        </div>
                    </div>
                ) : (
                    <div className='col-4 col-sm-2 result py-2 text-center'>{match.scoreA} - {match.scoreB}</div>
                )}
                <div className='d-none d-sm-block col-sm-1'></div>
                <div className={`col-4 text-center team ${match.playerBId === match.winner ? 'winner' : ''}`}>
                    <h4>{match.playerB?.name || '?'}</h4>
                    {match.playerB?.team && <p>{match.playerB.team}</p>}
                </div>
            </div>
        </div>
    );
};

export default Match;