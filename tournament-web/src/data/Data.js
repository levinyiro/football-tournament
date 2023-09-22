import bcrypt from 'bcryptjs';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, query, equalTo, set, child } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD0IR6rI7TZxxsQZZkv6RMgmKbY0aoZPiw",
    authDomain: "football-tournament-da5c6.firebaseapp.com",
    databaseURL: "https://football-tournament-da5c6-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "football-tournament-da5c6",
    storageBucket: "football-tournament-da5c6.appspot.com",
    messagingSenderId: "924060143399",
    appId: "1:924060143399:web:58cf1ef2ff2f915941a302"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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

    static tournaments = [];

    static async fetchTournaments() {
        try {
            const tournamentsRef = ref(database);
            const snapshot = await get(tournamentsRef);
            this.tournaments = [];

            snapshot.forEach(childSnapshot => {
                this.tournaments.push(childSnapshot.val());
            });
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        }
    }

    static getPlayersInGroup(tournament, group) {
        const players = group.players.map(playerId => {
            const gamesPlayed = group.matches.filter(
                match => (match.playerAId === playerId || match.playerBId === playerId) &&
                    match.scoreA !== '' && match.scoreB !== ''
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
                    match.scoreA !== '' && match.scoreB !== ''
            ).length;

            const gf = group.matches
                .filter(match => match.playerAId === playerId)
                .map(match => match.scoreA || 0)
                .reduce((a, c) => a + c, 0) + group.matches
                    .filter(match => match.playerBId === playerId)
                    .map(match => match.scoreB || 0)
                    .reduce((a, c) => a + c, 0);

            const ga = group.matches
                .filter(match => match.playerAId === playerId)
                .map(match => match.scoreB || 0)
                .reduce((a, c) => a + c, 0) + group.matches
                    .filter(match => match.playerBId === playerId)
                    .map(match => match.scoreA || 0)
                    .reduce((a, c) => a + c, 0);

            const playerDetails = tournament.players.find(x => x.id === playerId);

            return {
                id: playerDetails.id,
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

        return players;
    }

    static async getTournament(id) {
        let tournament = this.tournaments.find(tournament => tournament.id === id);
        tournament.matches = [];

        if (tournament.groups) {
            const groups = tournament.groups;
            tournament.groups = groups.map(group => {
                const players = this.getPlayersInGroup(tournament, group);

                return {
                    name: group.name,
                    players: players,
                    isReady: players.every(player => player.matchPlayed === players.length - 1),
                    promoted: 1, // how many players are promoted
                    matches: group.matches
                };
            });

            tournament.matches.push(...tournament.groups.map(group => {
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

            tournament.matches.push(...tournament.knockouts.map(knockout => {
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

        return tournament;
    }

    // static async registerUser(username, password) {
    //     const saltRounds = 10;
    //     const hashedPassword = await bcrypt.hash(password, saltRounds);

    //     console.log(hashedPassword);
    // }

    static async login(username, password) {
        if (username !== 'admin')
            return false;

        if (!await bcrypt.compare(password, '$2a$10$K1pBY/fx2jLgj6uTJotyq.ivYDM4udOonBODZzR/WsXD9UD2LH3W2'))
            return false;

        // const jwtToken = 'your_jwt_token_here';
        // localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('loggedIn', true);

        return true;
    }

    static async updatePlayer(newPlayer) {
        try {
            const tournamentsRef = ref(database);
            await this.fetchTournaments();

            const playerId = newPlayer.id;
            const playerDataToUpdate = {
                name: newPlayer.name,
                team: newPlayer.team
            };

            let playerUpdated = false;

            for (const tournament of this.tournaments) {
                const playerIndex = tournament.players.findIndex(player => player.id === playerId);
                if (playerIndex !== -1) {
                    tournament.players[playerIndex] = {
                        ...tournament.players[playerIndex],
                        ...playerDataToUpdate
                    };
                    playerUpdated = true;
                    break;
                }
            }

            if (playerUpdated) {
                await set(tournamentsRef, this.tournaments);
                console.log("Player updated successfully");
            } else {
                console.log("Player not found");
            }
        } catch (error) {
            console.error("Error updating player:", error);
        }
    }

    static async updateMatch(id, participant, score) {
        try {
            const tournamentsRef = ref(database);
            await this.fetchTournaments();
            let matchDataToUpdate;

            if (participant === 'a') {
                matchDataToUpdate = {
                    scoreA: score !== '' ? parseInt(score) : ''
                };
            } else if (participant === 'b') {
                matchDataToUpdate = {
                    scoreB: score !== '' ? parseInt(score) : ''
                };
            }

            let matchUpdated = false;
            // ha group meccset updateltünk, megnézzük, hogy melyiket, majd kitöltjük a knockout matcheket
                // itt lehetne a groupba írni, hogy melyik helyezettnek, melyik a knockoutbam elfoglalt helye 
            // ha knockout matchet, akkor megnézzük, hogy mi a rákövetkező - lehet ehhez kell egy nextMatchId

            let matchFound = false;
            for (const tournament of this.tournaments) {
                if (tournament.groups !== undefined) {
                    let isAllGroupReady = true;
                    for (const group of tournament.groups) {
                        const matchIndex = group.matches.findIndex(match => match.id === id);
                        if (matchIndex !== -1) {
                            matchFound = true;
                            group.matches[matchIndex] = {
                                ...group.matches[matchIndex],
                                ...matchDataToUpdate
                            };
                            matchUpdated = true;

                            const players = this.getPlayersInGroup(tournament, group);
                            if (players.every(player => player.matchPlayed === players.length - 1)) {
                                // set match participants
                                for (const knockout of tournament.knockouts) {
                                    for (const match of knockout.matches) {
                                        if (match.playerA.includes(group.name))
                                            match.playerAId = players[match.playerA.split(group.name)[1] - 1].id;
                                        else if (match.playerB.includes(group.name))
                                            match.playerBId = players[match.playerB.split(group.name)[1] - 1].id;
                                    }
                                }
                            } else {
                                isAllGroupReady = false;
                                for (const knockout of tournament.knockouts) {
                                    for (const match of knockout.matches) {
                                        for (const player of players) {
                                            if (match.playerAId !== '' && match.playerAId.includes(player.id)) {
                                                match.playerAId = '';
                                                match.scoreA = '';
                                                match.scoreB = '';
                                            }
                                            else if (match.playerBId !== '' && match.playerBId.includes(player.id)) {
                                                match.playerBId = '';
                                                match.scoreA = '';
                                                match.scoreB = '';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    if (matchFound) {
                        if (isAllGroupReady) {
                            // if every team are ready and there is place in knockout, replace it
                            // implement it here
                            // how many second position do we need?
                            // const secondPositions = tournament.totalPromoted / tournament.groups.length;
                            // console.log('div: ' + (tournament.totalPromoted / tournament.groups.length));
                            console.log('div: ' + Math.floor(tournament.totalPromoted / tournament.groups.length));
                            console.log('mod: ' + tournament.totalPromoted % tournament.groups.length);
                            const playersInDiv = [];
                            // get the n+1th position in groups desc by points
                            // I need a function, because of green line too
                            for (const group of tournament.groups) {
                                // playersInDiv.push(getPlayersMod(tournament, group));
                                const playersInGroup = this.getPlayersInGroup(tournament, group);
                                playersInDiv.push(playersInGroup[Math.floor(tournament.totalPromoted / tournament.groups.length)]);
                            }

                            // sort playersInDiv
                            playersInDiv.sort((a, b) => {
                                if (a.points !== b.points) {
                                    return b.points - a.points;
                                } else if (a.gd !== b.gd) {
                                    return b.gd - a.gd;
                                } else {
                                    return b.gf - a.gf;
                                }
                            });

                            for (let i = 0; i < tournament.totalPromoted % tournament.groups.length; i++) {
                                for (const knockout of tournament.knockouts) {
                                    for (const match of knockout.matches) {
                                        const searchString = "Mod " + (i + 1);
                                        if (match.playerA.includes(searchString))
                                            match.playerAId = playersInDiv[i].id;
                                        else if (match.playerB.includes(searchString)) {
                                            match.playerBId = playersInDiv[i].id;
                                            console.log(playersInDiv[i]);
                                        }
                                    }
                                }
                            }
                        }

                        break;
                    }
                }

                if (!matchUpdated && tournament.knockouts !== undefined) {
                    for (const knockout of tournament.knockouts) {
                        const matchIndex = knockout.matches.findIndex(match => match.id === id);
                        if (matchIndex !== -1) {
                            knockout.matches[matchIndex] = {
                                ...knockout.matches[matchIndex],
                                ...matchDataToUpdate
                            };
                            matchUpdated = true;
                            break;
                        }
                    }
                }
            }

            if (matchUpdated) {
                await set(tournamentsRef, this.tournaments);
                console.log("Match updated successfully");
            } else {
                console.log("Match not found");
            }
        } catch (error) {
            console.error("Error updating Match:", error);
        }
    }
}

export default Data;
