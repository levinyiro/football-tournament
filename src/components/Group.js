import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Data from '../data/Data';

function Group({ tournament, fetchTournament }) {
    const [actualPlayerModify, setActualPlayerModify] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [playerTeam, setPlayerTeam] = useState('');
    const { isLoggedIn } = useAuth();

    const openPlayerModal = async (playerId) => {
        setActualPlayerModify(playerId);
        const player = tournament.players.find(x => x.id === playerId);
        setPlayerName(player.name);
        setPlayerTeam(player.team);
    }

    const closePlayerModal = () => {
        setActualPlayerModify(null);
        setPlayerName('');
        setPlayerTeam('');
    }

    const handlePlayerModify = async (e) => {
        e.preventDefault();
        await Data.updatePlayer({ id: actualPlayerModify, name: playerName, team: playerTeam });
        fetchTournament();
        closePlayerModal();
    }

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
                                    <th className='d-none d-md-table-cell'>Team</th>
                                    <th>MP</th>
                                    <th>W</th>
                                    <th>D</th>
                                    <th>L</th>
                                    <th className='d-none d-md-table-cell'>GF</th>
                                    <th className='d-none d-md-table-cell'>GA</th>
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
                                            <td className='d-none d-md-table-cell'>{player.team}</td>
                                            <td>{player.name.trim() !== '' ? player.matchPlayed : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.won : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.draw : ''}</td>
                                            <td>{player.name.trim() !== '' ? player.lose : ''}</td>
                                            <td className='d-none d-md-table-cell'>{player.name.trim() !== '' ? player.gf : ''}</td>
                                            <td className='d-none d-md-table-cell'>{player.name.trim() !== '' ? player.ga : ''}</td>
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

            <Modal onHide={() => closePlayerModal()} show={actualPlayerModify}>
                <Modal.Header closeButton style={{ border: 0 }}>
                    <Modal.Title>
                        Modify {actualPlayerModify && tournament.players.find(x => x.id === actualPlayerModify).name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handlePlayerModify}>
                        <div className="mb-3">
                            <label htmlFor="inputPlayerName" className="form-label">Name</label>
                            <input required type="text" className="form-control" id="inputPlayerName" name="playerName" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                            <div className="invalid-feedback">Name is required</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputPlayerTeam" className="form-label">Team</label>
                            <input type="text" className="form-control" id="inputPlayerTeam" name="playerTeam" value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} />
                        </div>

                        <div className="row">
                            <div className="col-5">
                                <button className="btn btn-primary">Modify</button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
};

export default Group;