import bcrypt from 'bcryptjs-react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import date from 'date-and-time';

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
    static knockoutTypes = [
        'Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Third place', 'Final'
    ];

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
            const aIsEmpty = !a.name || a.name.trim() === '';
            const bIsEmpty = !b.name || b.name.trim() === '';

            if (aIsEmpty && !bIsEmpty) return 1;
            if (!aIsEmpty && bIsEmpty) return -1;

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

    static getPlayersInDiv(tournament) {
        const playersInDiv = [];

        if (tournament.groups.length === 1) {
            return playersInDiv;
        }

        for (const group of tournament.groups) {
            const playersInGroup = this.getPlayersInGroup(tournament, group);
            const promotedPerGroup = Math.floor(tournament.totalPromoted / tournament.groups.length);
            const player = playersInGroup[promotedPerGroup];

            if (player) {
                player.groupName = group.name;
                playersInDiv.push(player);
            }
        }

        playersInDiv.sort((a, b) => {
            if (a.points !== b.points) {
                return b.points - a.points;
            } else if (a.gd !== b.gd) {
                return b.gd - a.gd;
            } else {
                return b.gf - a.gf;
            }
        });

        return playersInDiv;
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
                    promoted: this.getPlayersInDiv(tournament)
                        .findIndex(player => player.groupName === group.name) < tournament.totalPromoted % tournament.groups.length ?
                        Math.floor(tournament.totalPromoted / tournament.groups.length) :
                        Math.floor(tournament.totalPromoted / tournament.groups.length) - 1,
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
            if (tournament.knockouts) {
                tournament.knockouts.forEach(knockout => {
                    knockout.matches.forEach(match => {
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
            }



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

    static async addTournament(data) {
        const tournamentsRef = ref(database);
        await this.fetchTournaments();

        const newPlayers = Array.from({ length: data.participantsValue }, (_, i) => ({
            id: uuidv4(),
            name: `Player${i + 1}`,
            team: ''
        }));

        const groupSizes = Array(data.groups).fill(Math.floor(data.participantsValue / data.groups));
        for (let i = 0; i < data.participantsValue % data.groups; i++) groupSizes[i]++;

        const newGroups = [];
        let lastPlayerIndex = 0;

        for (let i = 0; i < data.groups; i++) {
            const newGroup = {
                id: uuidv4(),
                name: 'Group ' + String.fromCharCode(i + 65),
                players: [],
                matches: []
            };

            const groupPlayers = [...newPlayers.slice(lastPlayerIndex, lastPlayerIndex + groupSizes[i])];
            for (let j = groupPlayers.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [groupPlayers[j], groupPlayers[k]] = [groupPlayers[k], groupPlayers[j]];
            }

            newGroup.players = groupPlayers.map(p => p.id);
            lastPlayerIndex += groupSizes[i];

            const playerCount = newGroup.players.length;

            for (let j = 0; j < playerCount; j++) {
                for (let k = j + 1; k < playerCount; k++) {
                    const playerA = newGroup.players[j];
                    const playerB = newGroup.players[k];
                    newGroup.matches.push({
                        id: uuidv4(),
                        playerAId: playerA,
                        playerBId: playerB,
                        scoreA: '',
                        scoreB: ''
                    });
                }
            }

            newGroups.push(newGroup);
        }

        const newKnockouts = [];
        const totalPromoted = parseInt(data.totalPromoted);

        const promotedPerGroup = Math.floor(totalPromoted / data.groups);
        const extraPromoted = totalPromoted % data.groups;

        let knockoutRounds = [];
        if (totalPromoted <= 2) {
            knockoutRounds = ['Final'];
        } else if (totalPromoted <= 4) {
            knockoutRounds = ['Semi-final', 'Final'];
            if (data.thirdPlace) knockoutRounds.splice(1, 0, 'Third place');
        } else if (totalPromoted <= 8) {
            knockoutRounds = ['Quarter-final', 'Semi-final', 'Final'];
            if (data.thirdPlace) knockoutRounds.splice(2, 0, 'Third place');
        } else if (totalPromoted <= 16) {
            knockoutRounds = ['Round of 16', 'Quarter-final', 'Semi-final', 'Final'];
            if (data.thirdPlace) knockoutRounds.splice(3, 0, 'Third place');
        }

        for (let roundIndex = 0; roundIndex < knockoutRounds.length; roundIndex++) {
            const roundName = knockoutRounds[roundIndex];
            const matchesCount = this.getMatchesCountForRound(roundName, totalPromoted, data.thirdPlace);
            const newMatches = [];

            for (let matchIndex = 0; matchIndex < matchesCount; matchIndex++) {
                let playerA = '';
                let playerB = '';
                let playerASource = null;
                let playerBSource = null;

                if (roundIndex === 0) {
                    [playerA, playerB, playerASource, playerBSource] = this.assignFirstRoundPositions(
                        matchIndex, data.groups, promotedPerGroup, extraPromoted, totalPromoted
                    );
                } else {
                    if (roundName === 'Third place') {
                        playerA = 'M1L';
                        playerB = 'M2L';
                        playerASource = { type: 'loser', matchPosition: 0, roundIndex: roundIndex - 1 };
                        playerBSource = { type: 'loser', matchPosition: 1, roundIndex: roundIndex - 1 };
                    } else {
                        playerA = `M${matchIndex * 2 + 1}W`;
                        playerB = `M${matchIndex * 2 + 2}W`;
                        playerASource = { type: 'winner', matchPosition: matchIndex * 2, roundIndex: roundIndex - 1 };
                        playerBSource = { type: 'winner', matchPosition: matchIndex * 2 + 1, roundIndex: roundIndex - 1 };
                    }
                }

                newMatches.push({
                    id: uuidv4(),
                    playerA: playerA,
                    playerAId: '',
                    playerB: playerB,
                    playerBId: '',
                    playerASource: playerASource,
                    playerBSource: playerBSource,
                    scoreA: '',
                    scoreB: ''
                });
            }

            const newKnockout = {
                name: roundName,
                matches: newMatches
            };
            newKnockouts.push(newKnockout);
        }

        const newTournament = {
            id: uuidv4(),
            date: date.format(new Date(), 'YYYY/MM/DD'),
            title: data.title,
            totalPromoted: totalPromoted,
            groups: newGroups,
            knockouts: newKnockouts,
            players: newPlayers
        };

        this.tournaments.push(newTournament);
        await set(tournamentsRef, this.tournaments);

        return newTournament.id;
    }

    static getMatchesCountForRound(roundName, totalPromoted, hasThirdPlace) {
        switch (roundName) {
            case 'Round of 16': return 8;
            case 'Quarter-final': return 4;
            case 'Semi-final': return 2;
            case 'Third place': return 1;
            case 'Final': return 1;
            default: return Math.floor(totalPromoted / 2);
        }
    }

    static assignFirstRoundPositions(matchIndex, groupsCount, promotedPerGroup, extraPromoted, totalPromoted) {
        let playerA = '';
        let playerB = '';
        let playerASource = null;
        let playerBSource = null;

        if (groupsCount === 1) {
            switch (totalPromoted) {
                case 2:
                    // Final only: 1. vs 2.
                    if (matchIndex === 0) {
                        playerA = `Group A P1`;
                        playerASource = { type: 'group', groupName: 'Group A', position: 0 };
                        playerB = `Group A P2`;
                        playerBSource = { type: 'group', groupName: 'Group A', position: 1 };
                    }
                    break;
                case 4:
                    switch (matchIndex) {
                        case 0:
                            playerA = `Group A P1`;
                            playerASource = { type: 'group', groupName: 'Group A', position: 0 };
                            playerB = `Group A P4`;
                            playerBSource = { type: 'group', groupName: 'Group A', position: 3 };
                            break;
                        case 1:
                            playerA = `Group A P2`;
                            playerASource = { type: 'group', groupName: 'Group A', position: 1 };
                            playerB = `Group A P3`;
                            playerBSource = { type: 'group', groupName: 'Group A', position: 2 };
                            break;
                        default:
                            break;
                    }
                    break;
                case 8:
                    switch (matchIndex) {
                        case 0:
                            playerA = `Group A P1`; playerASource = { type: 'group', groupName: 'Group A', position: 0 };
                            playerB = `Group A P8`; playerBSource = { type: 'group', groupName: 'Group A', position: 7 };
                            break;
                        case 1:
                            playerA = `Group A P2`; playerASource = { type: 'group', groupName: 'Group A', position: 1 };
                            playerB = `Group A P7`; playerBSource = { type: 'group', groupName: 'Group A', position: 6 };
                            break;
                        case 2:
                            playerA = `Group A P3`; playerASource = { type: 'group', groupName: 'Group A', position: 2 };
                            playerB = `Group A P6`; playerBSource = { type: 'group', groupName: 'Group A', position: 5 };
                            break;
                        case 3:
                            playerA = `Group A P4`; playerASource = { type: 'group', groupName: 'Group A', position: 3 };
                            playerB = `Group A P5`; playerBSource = { type: 'group', groupName: 'Group A', position: 4 };
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    const positionA = matchIndex;
                    const positionB = totalPromoted - 1 - matchIndex;

                    if (positionA < positionB) {
                        playerA = `Group A P${positionA + 1}`;
                        playerASource = { type: 'group', groupName: 'Group A', position: positionA };
                        playerB = `Group A P${positionB + 1}`;
                        playerBSource = { type: 'group', groupName: 'Group A', position: positionB };
                    }
                    break;
            }
        } else if (totalPromoted === 4) {
            switch (matchIndex) {
                case 0:
                    playerA = `Group A P1`;
                    playerASource = { type: 'group', groupName: 'Group A', position: 0 };
                    playerB = `Group B P2`;
                    playerBSource = { type: 'group', groupName: 'Group B', position: 1 };
                    break;
                case 1:
                    playerA = `Group B P1`;
                    playerASource = { type: 'group', groupName: 'Group B', position: 0 };
                    playerB = `Group A P2`;
                    playerBSource = { type: 'group', groupName: 'Group A', position: 1 };
                    break;
                default:
                    break;
            }
        }
        else if (totalPromoted === 8) {
            switch (matchIndex) {
                case 0:
                    playerA = `Group A P1`; playerASource = { type: 'group', groupName: 'Group A', position: 0 };
                    playerB = `Group B P2`; playerBSource = { type: 'group', groupName: 'Group B', position: 1 };
                    break;
                case 1:
                    playerA = `Group C P1`; playerASource = { type: 'group', groupName: 'Group C', position: 0 };
                    playerB = `Group D P2`; playerBSource = { type: 'group', groupName: 'Group D', position: 1 };
                    break;
                case 2:
                    playerA = `Group B P1`; playerASource = { type: 'group', groupName: 'Group B', position: 0 };
                    playerB = `Group A P2`; playerBSource = { type: 'group', groupName: 'Group A', position: 1 };
                    break;
                case 3:
                    playerA = `Group D P1`; playerASource = { type: 'group', groupName: 'Group D', position: 0 };
                    playerB = `Group C P2`; playerBSource = { type: 'group', groupName: 'Group C', position: 1 };
                    break;
                default:
                    break;
            }
        }
        else {
            const groupAIndex = matchIndex % groupsCount;
            const isFirstInPair = matchIndex % 2 === 0;

            if (isFirstInPair) {
                const groupIndexA = groupAIndex;
                const groupIndexB = (groupAIndex + 1) % groupsCount;

                playerA = `Group ${String.fromCharCode(65 + groupIndexA)} P1`;
                playerASource = { type: 'group', groupName: `Group ${String.fromCharCode(65 + groupIndexA)}`, position: 0 };

                playerB = `Group ${String.fromCharCode(65 + groupIndexB)} P2`;
                playerBSource = { type: 'group', groupName: `Group ${String.fromCharCode(65 + groupIndexB)}`, position: 1 };
            } else {
                const groupIndexA = groupAIndex;
                const groupIndexB = (groupAIndex + 1) % groupsCount;

                playerA = `Group ${String.fromCharCode(65 + groupIndexB)} P1`;
                playerASource = { type: 'group', groupName: `Group ${String.fromCharCode(65 + groupIndexB)}`, position: 0 };

                playerB = `Group ${String.fromCharCode(65 + groupIndexA)} P2`;
                playerBSource = { type: 'group', groupName: `Group ${String.fromCharCode(65 + groupIndexA)}`, position: 1 };
            }
        }

        return [playerA, playerB, playerASource, playerBSource];
    }

    static getKnockoutRounds(totalPromoted, hasThirdPlace) {
        let rounds = [];

        if (totalPromoted <= 2) {
            rounds = ['Final'];
        } else if (totalPromoted <= 4) {
            rounds = ['Semi-final', 'Final'];
            if (hasThirdPlace) rounds.splice(1, 0, 'Third place');
        } else if (totalPromoted <= 8) {
            rounds = ['Quarter-final', 'Semi-final', 'Final'];
            if (hasThirdPlace) rounds.splice(2, 0, 'Third place');
        } else if (totalPromoted <= 16) {
            rounds = ['Round of 16', 'Quarter-final', 'Semi-final', 'Final'];
            if (hasThirdPlace) rounds.splice(3, 0, 'Third place');
        } else if (totalPromoted <= 32) {
            rounds = ['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Final'];
            if (hasThirdPlace) rounds.splice(4, 0, 'Third place');
        }

        return rounds;
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
                matchDataToUpdate = { scoreA: score !== '' ? parseInt(score) : '' };
            } else if (participant === 'b') {
                matchDataToUpdate = { scoreB: score !== '' ? parseInt(score) : '' };
            }

            let matchUpdated = false;
            let matchFound = false;

            for (const tournament of this.tournaments) {
                if (tournament.groups !== undefined) {
                    for (const group of tournament.groups) {
                        const matchIndex = group.matches.findIndex(match => match.id === id);
                        if (matchIndex !== -1) {
                            matchFound = true;
                            group.matches[matchIndex] = {
                                ...group.matches[matchIndex],
                                ...matchDataToUpdate
                            };
                            matchUpdated = true;

                            this.updateAllKnockoutPlayers(tournament);
                            break;
                        }
                    }

                    if (matchFound) break;
                }

                if (!matchUpdated && tournament.knockouts !== undefined) {
                    for (let i = 0; i < tournament.knockouts.length; i++) {
                        const matchIndex = tournament.knockouts[i].matches.findIndex(match => match.id === id);
                        if (matchIndex !== -1) {
                            const actualMatch = tournament.knockouts[i].matches[matchIndex];

                            tournament.knockouts[i].matches[matchIndex] = {
                                ...actualMatch,
                                ...matchDataToUpdate
                            };
                            matchUpdated = true;

                            this.updateKnockoutProgress(tournament, i, matchIndex, actualMatch, participant, score);
                            break;
                        }
                    }
                }
            }

            if (matchUpdated) {
                await set(tournamentsRef, this.tournaments);
            }
        } catch (error) {
            console.error("Error updating Match:", error);
        }
    }

    static updateKnockoutProgress(tournament, currentRoundIndex, matchIndex, actualMatch, participant, score) {
        if (tournament.knockouts[currentRoundIndex].name !== 'Third place' &&
            tournament.knockouts[currentRoundIndex].name !== 'Final') {

            let nextKnockoutIndex = currentRoundIndex + 1;

            if (nextKnockoutIndex < tournament.knockouts.length) {

                if (tournament.knockouts[currentRoundIndex].name === 'Semi-final' &&
                    tournament.knockouts[nextKnockoutIndex] &&
                    tournament.knockouts[nextKnockoutIndex].name === 'Third place') {

                    const nextMatch = tournament.knockouts[nextKnockoutIndex].matches[0];
                    if (nextMatch && nextMatch.playerASource && nextMatch.playerASource.type === 'loser' &&
                        nextMatch.playerASource.matchPosition === matchIndex) {
                        nextMatch.playerAId = actualMatch.scoreA < actualMatch.scoreB ? actualMatch.playerAId : actualMatch.playerBId;
                    } else if (nextMatch && nextMatch.playerBSource && nextMatch.playerBSource.type === 'loser' &&
                        nextMatch.playerBSource.matchPosition === matchIndex) {
                        nextMatch.playerBId = actualMatch.scoreA < actualMatch.scoreB ? actualMatch.playerAId : actualMatch.playerBId;
                    }
                    nextKnockoutIndex++;
                }

                if (nextKnockoutIndex < tournament.knockouts.length) {
                    const nextRoundMatchIndex = Math.floor(matchIndex / 2);
                    if (nextRoundMatchIndex < tournament.knockouts[nextKnockoutIndex].matches.length) {
                        const nextMatch = tournament.knockouts[nextKnockoutIndex].matches[nextRoundMatchIndex];

                        if (nextMatch && nextMatch.playerASource && nextMatch.playerASource.type === 'winner' &&
                            nextMatch.playerASource.matchPosition === matchIndex) {
                            nextMatch.playerAId = actualMatch.scoreA > actualMatch.scoreB ? actualMatch.playerAId : actualMatch.playerBId;
                        } else if (nextMatch && nextMatch.playerBSource && nextMatch.playerBSource.type === 'winner' &&
                            nextMatch.playerBSource.matchPosition === matchIndex) {
                            nextMatch.playerBId = actualMatch.scoreA > actualMatch.scoreB ? actualMatch.playerAId : actualMatch.playerBId;
                        }
                    }
                }

                if (score === '') {
                    const playerId = participant === 'a' ? actualMatch.playerAId : actualMatch.playerBId;
                    this.clearPlayerFromLaterRounds(tournament, currentRoundIndex, playerId);
                }
            }
        }
    }

    static clearPlayerFromLaterRounds(tournament, currentRoundIndex, playerId) {
        for (let j = currentRoundIndex + 1; j < tournament.knockouts.length; j++) {
            for (const match of tournament.knockouts[j].matches) {
                if (match.playerAId === playerId) {
                    match.playerAId = '';
                    match.scoreA = '';
                    match.scoreB = '';
                } else if (match.playerBId === playerId) {
                    match.playerBId = '';
                    match.scoreA = '';
                    match.scoreB = '';
                }
            }
        }
    }

    static updateAllKnockoutPlayers(tournament) {
        for (const group of tournament.groups) {
            const players = this.getPlayersInGroup(tournament, group);

            for (const knockout of tournament.knockouts) {
                for (const match of knockout.matches) {
                    if (match.playerASource && match.playerASource.type === 'group' &&
                        match.playerASource.groupName === group.name) {

                        if (match.playerASource.position < players.length) {
                            match.playerAId = players[match.playerASource.position].id;
                        }
                    }

                    if (match.playerBSource && match.playerBSource.type === 'group' &&
                        match.playerBSource.groupName === group.name) {

                        if (match.playerBSource.position < players.length) {
                            match.playerBId = players[match.playerBSource.position].id;
                        }
                    }
                }
            }
        }

        const playersInDiv = this.getPlayersInDiv(tournament);
        for (const knockout of tournament.knockouts) {
            for (const match of knockout.matches) {
                if (match.playerASource && match.playerASource.type === 'mod') {
                    const modPosition = match.playerASource.modPosition;
                    if (modPosition < playersInDiv.length) {
                        match.playerAId = playersInDiv[modPosition].id;
                    }
                }
                if (match.playerBSource && match.playerBSource.type === 'mod') {
                    const modPosition = match.playerBSource.modPosition;
                    if (modPosition < playersInDiv.length) {
                        match.playerBId = playersInDiv[modPosition].id;
                    }
                }
            }
        }
    }
}

export default Data;
