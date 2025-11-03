import Match from './Match';

function Knockout({ tournament, fetchTournament }) {
    return (
        <div className="knockout-tab mb-5">
            {tournament.knockouts && tournament.knockouts.map((knockout, index) => (
                <div key={index}>
                    <h3 className='text-center mt-5 lead'>{knockout.name}</h3>
                    <div className={`container card mt-4 ${knockout.name === 'Third place' ? 'bronze' : ''} ${knockout.name === 'Final' ? 'gold' : ''}`}>
                        {knockout.matches.map((match, matchIndex) => (
                            <Match match={match} matchIndex={matchIndex} fetchTournament={fetchTournament} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Knockout;