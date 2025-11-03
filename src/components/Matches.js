import Match from './Match';

function Matches({ tournament, fetchTournament }) {
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
                                <Match match={innerMatch} matchIndex={innerMatchIndex} fetchTournament={fetchTournament} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    )
};

export default Matches;