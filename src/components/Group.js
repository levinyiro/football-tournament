function Group({ tournament, isLoggedIn, openPlayerModal }) {
    return (
        <div className="tab-content mb-5">
            {tournament.groups && tournament.groups.map((group, index) => {
                const totalPromoted = parseInt(tournament.totalPromoted);
                const groupCount = tournament.groups.length;

                const basePromoted = Math.floor(totalPromoted / groupCount);
                const extraPromoted = totalPromoted % groupCount;

                const promotedInThisGroup = basePromoted + (index < extraPromoted ? 1 : 0);

                return (
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
                                    const rowClass = (playerIndex < promotedInThisGroup) ? "green-row" : "";

                                    return (
                                        <tr key={playerIndex} className={rowClass}>
                                            <td>{playerIndex + 1}</td>
                                            <td>{player.name}</td>
                                            <td>{player.team}</td>
                                            <td>{player.name.trim() !== '' ? player.matchPlayed : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.won : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.draw : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.lose : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.gf : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.ga : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.gd : ''}</td>
                                            <td style={{ fontWeight: 'bold' }}>{player.name.trim() !== '' ? player.points : ''}</td>
                                            {isLoggedIn && (
                                                <td>
                                                    <button className='btn btn-primary btn-sm' onClick={() => openPlayerModal(player.id)}>Modify</button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    )
};

export default Group;