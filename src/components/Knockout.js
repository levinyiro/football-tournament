function Knockout({ tournament, isLoggedIn, modifyMatch }) {
    return (
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
                                    <div className='d-none d-sm-block col-sm-1'></div>

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
                                        <div className='col-4 col-sm-2 result py-2 text-center'>{match.scoreA} - {match.scoreB}</div>
                                    )}

                                    <div className='d-none d-sm-block col-sm-1'></div>
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
    )
};

export default Knockout;