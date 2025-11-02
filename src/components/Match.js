function Match({ match, matchIndex, isLoggedIn, modifyMatch, showDivider = true }) {
    return (
        <div key={match.id || matchIndex}>
            {showDivider && matchIndex !== 0 && <hr className='m-1' />}
            <div className='row d-flex align-items-center p-3'>
                {/* Player A */}
                <div className={`col-4 text-center team ${match.playerAId === match.winner ? 'winner' : ''}`}>
                    <h4>{match.playerA?.name || '?'}</h4>
                    {match.playerA?.team && <p>{match.playerA.team}</p>}
                </div>

                <div className='d-none d-sm-block col-sm-1'></div>

                {/* Score Input/Display */}
                {isLoggedIn ? (
                    <div className='col-2 py-2 row'>
                        <div className='col-4'>
                            <input
                                type="text"
                                id={`a;${match.id}`}
                                value={match.scoreA}
                                className='form-control text-center'
                                onChange={e => modifyMatch(e.target)}
                                style={{ backgroundColor: match.playerAId === match.winner ? '#d4edda' : (match.playerBId === match.winner ? '#f8d7da' : 'white') }}
                            />
                        </div>
                        <div className='col-4 d-flex justify-content-center align-items-center'>-</div>
                        <div className='col-4'>
                            <input
                                type="text"
                                id={`b;${match.id}`}
                                value={match.scoreB}
                                className='form-control text-center'
                                onChange={e => modifyMatch(e.target)}
                                style={{ backgroundColor: match.playerBId === match.winner ? '#d4edda' : (match.playerAId === match.winner ? '#f8d7da' : 'white') }}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        className='col-4 col-sm-2 result py-2 text-center'
                        style={{
                            backgroundColor: match.winner ? '#e9ecef' : 'transparent',
                            borderRadius: '4px'
                        }}
                    >
                        {match.scoreA} - {match.scoreB}
                    </div>
                )}

                <div className='d-none d-sm-block col-sm-1'></div>

                {/* Player B */}
                <div className={`col-4 text-center team ${match.playerBId === match.winner ? 'winner' : ''}`}>
                    <h4>{match.playerB?.name || '?'}</h4>
                    {match.playerB?.team && <p>{match.playerB.team}</p>}
                </div>
            </div>
        </div>
    );
};

export default Match;