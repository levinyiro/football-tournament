import jsonData from './tournaments2.json';

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
        const tournament = jsonData.find(tournament => tournament.id === id)


        tournament.groups.map(group => {
            const players = tournament.players.map(playerId => {
                const player = tournament.players.find(p => p.id === playerId);
                console.log(player);
                const gamesPlayed = group.matches.filter(
                    match => match.playerAId === playerId || match.playerBId === playerId
                ).length;
                const won = group.matches.filter(
                    match =>
                        (match.playerAId === playerId && match.scoreA > match.scoreB) ||
                        (match.playerBId === playerId && match.scoreB > match.scoreA)
                ).length;
                const drawn = group.matches.filter(
                    match =>
                        match.scoreA === match.scoreB &&
                        (match.playerAId === playerId || match.playerBId === playerId)
                ).length;
                const lost = gamesPlayed - won - drawn;

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

                const gd = gf - ga;
                const points = won * 3 + drawn;


                return {
                    id: playerId,
                    name: player.name,
                    team: player.team,
                    matchPlayed: gamesPlayed,
                    won: won,
                    draw: drawn,
                    lose: lost,
                    gf: gf,
                    ga: ga,
                    gd: gd,
                    points: points
                };
            });

            return {
                name: group.name,
                players: players
            };
        });

    }

    // static updateTournaments(modifiedData) {
    //     this.tournaments = modifiedData;
    // }
}

export default Data;
