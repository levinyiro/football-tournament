function Matches({ tournament, isLoggedIn, modifyMatch }) {
    return (
        <div className="matches-tab mb-5">
            {tournament.matches && tournament.matches.map((match, index) => {
                const visibleMatches = match.matches.filter(innerMatch =>
                    innerMatch.playerA?.name?.trim() !== '' && innerMatch.playerB?.name?.trim() !== ''
                );

                return (
                    <div key={index}>
                        <h3 className='text-center mt-5 lead'>{match.name}</h3>
                        <div className="container card p-3 mt-4">
                            {visibleMatches.map((innerMatch, innerMatchIndex) => (
                                <div key={innerMatch.id || innerMatchIndex}>
                                    {innerMatchIndex !== 0 && <hr className='m-1' />}
                                    <div className='row d-flex align-items-center p-3'>
                                        <div className={`col-4 text-center team ${innerMatch.playerAId === innerMatch.winner ? 'winner' : ''}`}>
                                            <h4>{innerMatch.playerA?.name || '?'}</h4>
                                            {innerMatch.playerA?.team && <p>{innerMatch.playerA.team}</p>}
                                        </div>
                                        <div className='d-none d-sm-block col-sm-1'></div>
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
                                            <div className='col-4 col-sm-2 result py-2 text-center'>{innerMatch.scoreA} - {innerMatch.scoreB}</div>
                                        )}
                                        <div className='d-none d-sm-block col-sm-1'></div>
                                        <div className={`col-4 text-center team ${innerMatch.playerBId === innerMatch.winner ? 'winner' : ''}`}>
                                            <h4>{innerMatch.playerB?.name || '?'}</h4>
                                            {innerMatch.playerB?.team && <p>{innerMatch.playerB.team}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    )
};

export default Matches;