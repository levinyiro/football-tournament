import bcrypt from 'bcryptjs';
import jsonData from './tournaments.json';
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

    static async getTournaments() {
        try {
            const tournamentsRef = ref(database);
            const snapshot = await get(tournamentsRef);
            const tournaments = [];

            snapshot.forEach(childSnapshot => {
                const tournamentData = childSnapshot.val();
                tournaments.push({
                    id: tournamentData.id,
                    title: tournamentData.title,
                    date: tournamentData.date
                });
            });

            return tournaments;
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            return [];
        }
    }

    static async getTournament(id) {
        let tournament = null;
        try {
            const tournamentsRef = ref(database);
            const snapshot = await get(tournamentsRef);
            snapshot.forEach(childSnapshot => {
                const tourmanentData = childSnapshot.val();
                if (tourmanentData.id === id) {
                    tournament = tourmanentData;
                }
            });

            return tournament;
        } catch (error) {
            console.error('Error fetching tournaments');
            return null;
        }
    }

    static async getGroups(id) {
        const tournament = await this.getTournament(id);

        const data = tournament.groups.map(group => {
            const players = group.players.map(playerId => {
                const playerDetails = tournament.players.find(player => player.id === playerId);

                const gamesPlayed = group.matches.filter(
                    match => (match.playerAId === playerId || match.playerBId === playerId) &&
                        match.scoreA !== undefined && match.scoreB !== undefined
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
                        match.scoreA !== undefined && match.scoreB !== undefined
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
        const tournament = await this.getTournament(id);
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
        const tournament = await this.getTournament(id);

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
            const snapshot = await get(tournamentsRef);
            const tournaments = [];

            snapshot.forEach(childSnapshot => {
                const tournamentData = childSnapshot.val();
                tournaments.push(tournamentData);
            });

            const playerId = newPlayer.id;
            const playerDataToUpdate = {
                name: newPlayer.name,
                team: newPlayer.team
            };

            let playerUpdated = false;

            for (const tournament of tournaments) {
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
                // Update tournaments data in Firebase
                await set(tournamentsRef, tournaments);
                console.log("Player updated successfully");
            } else {
                console.log("Player not found");
            }
        } catch (error) {
            console.error("Error updating player:", error);
        }
    }
}

export default Data;
