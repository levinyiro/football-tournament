import jsonData from './tournaments.json';

class Data {
    // static async getTournaments() {
    //     try {
    //         const response = await fetch('https://car-racing-tournament-api.azurewebsites.net/api/season');
    //         const data = await response.json();
    //         this.fetchedTournaments = data;
    //         return this.fetchedTournaments;
    //     } catch (error) {
    //         console.error('Error fetching tournaments:', error);
    //         return [];
    //     }
    // }

    static async getTournaments() {
        return jsonData.map(tournament => ({
            id: tournament.id,
            title: tournament.title,
            date: tournament.date
        }));
    }

    static async getTournament(id) {
        return jsonData.find(tournament => tournament.id === id);
    }

    static async getGroups(id) {
        const tournament = jsonData.find(tournament => tournament.id === id);

        const data = tournament.groups.map(group => {
            const players = group.players.map(playerId => {
                const playerDetails = tournament.players.find(player => player.id === playerId);

                const gamesPlayed = group.matches.filter(
                    match => (match.playerAId === playerId || match.playerBId === playerId) &&
                        match.scoreA !== null && match.scoreB !== null
                ).length;

                const won = group.matches.filter(
                    match =>
                        (match.playerAId === playerId && match.scoreA > match.scoreB) ||
                        (match.playerBId === playerId && match.scoreB > match.scoreA)
                ).length;

                const drawn = group.matches.filter(
                    match =>
                        match.scoreA === match.scoreB &&
                        (match.playerAId === playerId || match.playerBId === playerId) &&
                        match.scoreA !== null && match.scoreB !== null
                ).length;

                const gf = group.matches
                    .filter(match => match.playerAId === playerId)
                    .map(match => match.scoreA)
                    .reduce((a, c) => a + c, 0) + group.matches
                        .filter(match => match.playerBId === playerId)
                        .map(match => match.scoreB)
                        .reduce((a, c) => a + c, 0);

                const ga = group.matches
                    .filter(match => match.playerAId === playerId)
                    .map(match => match.scoreB)
                    .reduce((a, c) => a + c, 0) + group.matches
                        .filter(match => match.playerBId === playerId)
                        .map(match => match.scoreA)
                        .reduce((a, c) => a + c, 0);

                return {
                    id: playerId,
                    name: playerDetails.name,
                    team: playerDetails.team,
                    matchPlayed: gamesPlayed,
                    won: won,
                    draw: drawn,
                    lose: gamesPlayed - won - drawn,
                    gf: gf,
                    ga: ga,
                    gd: gf - ga,
                    points: won * 3 + drawn
                };
            });

            players.sort((a, b) => {
                if (a.points !== b.points) {
                    return b.points - a.points;
                } else if (a.gd !== b.gd) {
                    return b.gd - a.gd;
                } else {
                    return b.gf - a.gf;
                }
            });

            return {
                name: group.name,
                players: players,
                isReady: players.every(player => player.matchPlayed === players.length - 1)
            };
        });

        return data;
    }

    static async getMatches(id) {
        const tournament = jsonData.find(tournament => tournament.id === id);
        const allMatches = [];

        if (tournament.groups) {
            allMatches.push(...tournament.groups.map(group => {
                const matches = group.matches.map(match => {
                    const playerA = tournament.players.find(player => player.id === match.playerAId);
                    const playerB = tournament.players.find(player => player.id === match.playerBId);
                    const winner = match.scoreA > match.scoreB 
                        ? match.playerAId 
                        : (match.scoreB > match.scoreA ? match.playerBId : null);
        
                    return {
                        ...match,
                        winner,
                        playerA,
                        playerB
                    };
                })
                
                return {
                    name: group.name,
                    matches: matches
                }
            }));
        }

        if (tournament.knockouts) {
            allMatches.push(...tournament.knockouts.map(knockout => {
                const matches = knockout.matches.map(match => {
                    const playerA = tournament.players.find(player => player.id === match.playerAId);
                    const playerB = tournament.players.find(player => player.id === match.playerBId);
                    const winner = match.scoreA > match.scoreB 
                        ? match.playerAId 
                        : (match.scoreB > match.scoreA ? match.playerBId : null);
        
                    return {
                        ...match,
                        winner,
                        playerA,
                        playerB
                    };
                })
                
                return {
                    name: knockout.name,
                    matches: matches
                }
            }));
        }
        
        return allMatches;
    }

    static async getKnockouts(id) {
        const tournament = jsonData.find(tournament => tournament.id === id);

        tournament.knockouts.map(knockout => {
            knockout.matches.map(match => {
                const playerA = tournament.players.find(player => player.id === match.playerAId);
                const playerB = tournament.players.find(player => player.id === match.playerBId);
                const winner = match.scoreA > match.scoreB 
                    ? match.playerAId 
                    : (match.scoreB > match.scoreA ? match.playerBId : null);

                match.playerA = playerA;
                match.playerB = playerB;
                match.winner = winner;
            });
        });

        return tournament.knockouts;
    }

    // static updateTournaments(modifiedData) {
    //     this.tournaments = modifiedData;
    // }
}

export default Data;
