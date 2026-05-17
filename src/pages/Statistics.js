import { useState, useEffect } from 'react';
import Data from '../data/Data';
import '../styles/stats.scss';

function Statistics() {
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalMatches: 0,
    totalGoals: 0,
    avgGoalsPerMatch: 0,
    activePlayerCount: 0,
  });

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      try {
        await Data.fetchTournaments();
        const tournamentsData = Data.tournaments;

        const playerStatsMap = {};
        const processedTournaments = [];

        tournamentsData.forEach((tournament) => {
          const tournamentStats = {
            title: tournament.title,
            date: tournament.date,
            winner: null,
            runnerUp: null,
            thirdPlace: null,
            totalMatches: 0,
            totalGoals: 0,
            medals: [],
          };

          // Track group stage stats separately to determine winner if no knockout
          const groupStageStats = {};

          // Process group stage matches
          (tournament.groups || []).forEach((group) => {
            (group.matches || []).forEach((match) => {
              if (match.scoreA !== '' && match.scoreB !== '') {
                const scoreA = parseInt(match.scoreA);
                const scoreB = parseInt(match.scoreB);
                const playerAId = match.playerAId;
                const playerBId = match.playerBId;

                let playerAName = '';
                let playerBName = '';

                tournament.players.forEach((p) => {
                  if (p.id === playerAId) playerAName = p.name;
                  if (p.id === playerBId) playerBName = p.name;
                });

                if (playerAName && playerBName) {
                  if (!playerStatsMap[playerAName]) {
                    playerStatsMap[playerAName] = {
                      matches: 0,
                      wins: 0,
                      losses: 0,
                      draws: 0,
                      goalsFor: 0,
                      goalsAgainst: 0,
                      tournaments: new Set(),
                      tournamentWins: 0,
                      goldMedals: 0,
                      silverMedals: 0,
                      bronzeMedals: 0,
                      matchesDetail: [],
                    };
                  }
                  if (!playerStatsMap[playerBName]) {
                    playerStatsMap[playerBName] = {
                      matches: 0,
                      wins: 0,
                      losses: 0,
                      draws: 0,
                      goalsFor: 0,
                      goalsAgainst: 0,
                      tournaments: new Set(),
                      tournamentWins: 0,
                      goldMedals: 0,
                      silverMedals: 0,
                      bronzeMedals: 0,
                      matchesDetail: [],
                    };
                  }

                  playerStatsMap[playerAName].tournaments.add(tournament.title);
                  playerStatsMap[playerBName].tournaments.add(tournament.title);
                  playerStatsMap[playerAName].matches++;
                  playerStatsMap[playerBName].matches++;
                  playerStatsMap[playerAName].goalsFor += scoreA;
                  playerStatsMap[playerAName].goalsAgainst += scoreB;
                  playerStatsMap[playerBName].goalsFor += scoreB;
                  playerStatsMap[playerBName].goalsAgainst += scoreA;

                  tournamentStats.totalMatches++;
                  tournamentStats.totalGoals += scoreA + scoreB;

                  // Track group stage stats
                  if (!groupStageStats[playerAName]) {
                    groupStageStats[playerAName] = { wins: 0, losses: 0, draws: 0, matches: 0 };
                  }
                  if (!groupStageStats[playerBName]) {
                    groupStageStats[playerBName] = { wins: 0, losses: 0, draws: 0, matches: 0 };
                  }

                  groupStageStats[playerAName].matches++;
                  groupStageStats[playerBName].matches++;

                  if (scoreA > scoreB) {
                    playerStatsMap[playerAName].wins++;
                    playerStatsMap[playerBName].losses++;
                    groupStageStats[playerAName].wins++;
                    groupStageStats[playerBName].losses++;
                  } else if (scoreB > scoreA) {
                    playerStatsMap[playerBName].wins++;
                    playerStatsMap[playerAName].losses++;
                    groupStageStats[playerBName].wins++;
                    groupStageStats[playerAName].losses++;
                  } else {
                    playerStatsMap[playerAName].draws++;
                    playerStatsMap[playerBName].draws++;
                    groupStageStats[playerAName].draws++;
                    groupStageStats[playerBName].draws++;
                  }
                }
              }
            });
          });

          // Process knockout matches
          (tournament.knockouts || []).forEach((round) => {
            (round.matches || []).forEach((match) => {
              if (match.scoreA !== '' && match.scoreB !== '' && match.playerAId && match.playerBId) {
                const scoreA = parseInt(match.scoreA);
                const scoreB = parseInt(match.scoreB);
                const playerAId = match.playerAId;
                const playerBId = match.playerBId;

                let playerAName = '';
                let playerBName = '';

                tournament.players.forEach((p) => {
                  if (p.id === playerAId) playerAName = p.name;
                  if (p.id === playerBId) playerBName = p.name;
                });

                if (playerAName && playerBName) {
                  if (!playerStatsMap[playerAName]) {
                    playerStatsMap[playerAName] = {
                      matches: 0,
                      wins: 0,
                      losses: 0,
                      draws: 0,
                      goalsFor: 0,
                      goalsAgainst: 0,
                      tournaments: new Set(),
                      tournamentWins: 0,
                      goldMedals: 0,
                      silverMedals: 0,
                      bronzeMedals: 0,
                      matchesDetail: [],
                    };
                  }
                  if (!playerStatsMap[playerBName]) {
                    playerStatsMap[playerBName] = {
                      matches: 0,
                      wins: 0,
                      losses: 0,
                      draws: 0,
                      goalsFor: 0,
                      goalsAgainst: 0,
                      tournaments: new Set(),
                      tournamentWins: 0,
                      goldMedals: 0,
                      silverMedals: 0,
                      bronzeMedals: 0,
                      matchesDetail: [],
                    };
                  }

                  playerStatsMap[playerAName].tournaments.add(tournament.title);
                  playerStatsMap[playerBName].tournaments.add(tournament.title);
                  playerStatsMap[playerAName].matches++;
                  playerStatsMap[playerBName].matches++;
                  playerStatsMap[playerAName].goalsFor += scoreA;
                  playerStatsMap[playerAName].goalsAgainst += scoreB;
                  playerStatsMap[playerBName].goalsFor += scoreB;
                  playerStatsMap[playerBName].goalsAgainst += scoreA;

                  tournamentStats.totalMatches++;
                  tournamentStats.totalGoals += scoreA + scoreB;

                  // Track tournament winners
                  if (round.name === 'Final') {
                    if (scoreA > scoreB) {
                      tournamentStats.winner = playerAName;
                      tournamentStats.runnerUp = playerBName;
                      playerStatsMap[playerAName].tournamentWins++;
                    } else if (scoreB > scoreA) {
                      tournamentStats.winner = playerBName;
                      tournamentStats.runnerUp = playerAName;
                      playerStatsMap[playerBName].tournamentWins++;
                    }
                  } else if (round.name === 'Third place') {
                    if (scoreA > scoreB) {
                      tournamentStats.thirdPlace = playerAName;
                    } else if (scoreB > scoreA) {
                      tournamentStats.thirdPlace = playerBName;
                    }
                  }

                  if (scoreA > scoreB) {
                    playerStatsMap[playerAName].wins++;
                    playerStatsMap[playerBName].losses++;
                  } else if (scoreB > scoreA) {
                    playerStatsMap[playerBName].wins++;
                    playerStatsMap[playerAName].losses++;
                  } else {
                    playerStatsMap[playerAName].draws++;
                    playerStatsMap[playerBName].draws++;
                  }
                }
              }
            });
          });

          // If no knockout stage, determine winner from group stage
          if (!tournamentStats.winner && Object.keys(groupStageStats).length > 0) {
            // Sort players by points, goal difference, and goals for (like group standings)
            const sortedByStandings = Object.entries(groupStageStats)
              .map(([name, stats]) => {
                const points = stats.wins * 3 + stats.draws;
                const goalsFor = playerStatsMap[name]?.goalsFor || 0;
                const goalsAgainst = playerStatsMap[name]?.goalsAgainst || 0;
                const goalDiff = goalsFor - goalsAgainst;
                return {
                  name,
                  points,
                  goalDiff,
                  goalsFor,
                  stats,
                };
              })
              .sort((a, b) => {
                if (a.points !== b.points) return b.points - a.points;
                if (a.goalDiff !== b.goalDiff) return b.goalDiff - a.goalDiff;
                return b.goalsFor - a.goalsFor;
              });

            // Award medals
            if (sortedByStandings[0]) {
              tournamentStats.winner = sortedByStandings[0].name;
              playerStatsMap[sortedByStandings[0].name].tournamentWins++;
              playerStatsMap[sortedByStandings[0].name].goldMedals++;
            }
            if (sortedByStandings[1]) {
              tournamentStats.runnerUp = sortedByStandings[1].name;
              playerStatsMap[sortedByStandings[1].name].silverMedals++;
            }
            if (sortedByStandings[2]) {
              tournamentStats.thirdPlace = sortedByStandings[2].name;
              playerStatsMap[sortedByStandings[2].name].bronzeMedals++;
            }
          } else if (tournamentStats.winner) {
            // Award medals from knockout stage
            playerStatsMap[tournamentStats.winner].goldMedals++;
            if (tournamentStats.runnerUp) {
              playerStatsMap[tournamentStats.runnerUp].silverMedals++;
            }
            if (tournamentStats.thirdPlace) {
              playerStatsMap[tournamentStats.thirdPlace].bronzeMedals++;
            }
          }

          processedTournaments.push(tournamentStats);
        });

        // Convert tournaments set to array
        Object.keys(playerStatsMap).forEach((name) => {
          playerStatsMap[name].tournaments = Array.from(playerStatsMap[name].tournaments);
        });

        // Sort players by medals (primary), then by win rate (secondary)
        const sorted = Object.entries(playerStatsMap).sort((a, b) => {
          const totalMedalsA = a[1].goldMedals + a[1].silverMedals + a[1].bronzeMedals;
          const totalMedalsB = b[1].goldMedals + b[1].silverMedals + b[1].bronzeMedals;

          // Primary sort: by total medals (descending)
          if (totalMedalsA !== totalMedalsB) {
            return totalMedalsB - totalMedalsA;
          }

          // Secondary sort: by gold medals (descending)
          if (a[1].goldMedals !== b[1].goldMedals) {
            return b[1].goldMedals - a[1].goldMedals;
          }

          // Tertiary sort: by silver medals (descending)
          if (a[1].silverMedals !== b[1].silverMedals) {
            return b[1].silverMedals - a[1].silverMedals;
          }

          // Quaternary sort: by bronze medals (descending)
          if (a[1].bronzeMedals !== b[1].bronzeMedals) {
            return b[1].bronzeMedals - a[1].bronzeMedals;
          }

          // Final fallback: by win rate
          const winRateA = (a[1].wins / a[1].matches) * 100;
          const winRateB = (b[1].wins / b[1].matches) * 100;
          return winRateB - winRateA;
        });

        // Calculate overall stats
        const totalMatches = sorted.reduce((sum, p) => sum + p[1].matches, 0) / 2;
        const totalGoals = sorted.reduce((sum, p) => sum + p[1].goalsFor, 0) / 2;

        setSortedPlayers(sorted);
        setTournaments(processedTournaments);
        setOverallStats({
          totalMatches: Math.round(totalMatches),
          totalGoals: Math.round(totalGoals),
          avgGoalsPerMatch: (totalGoals / totalMatches).toFixed(2),
          activePlayerCount: sorted.length,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
      setIsLoading(false);
    };

    fetchAndProcessData();
  }, []);

  if (isLoading) {
    return (
      <div className="Statistics">
        <div className="header">
          <h1>⚽ FIFA Turné Statisztikák</h1>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Betöltés...</span>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="Statistics">
      <div className="container">
        {/* Overall Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Összes mérkőzés</div>
            <div className="stat-value">{overallStats.totalMatches}</div>
            <div className="stat-subtitle">Játszott mérkőzések a tornákon</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Összes gól</div>
            <div className="stat-value">{overallStats.totalGoals}</div>
            <div className="stat-subtitle">Gólok az összes mérkőzésben</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Átlagos gólok/mérkőzés</div>
            <div className="stat-value">{overallStats.avgGoalsPerMatch}</div>
            <div className="stat-subtitle">Mérkőzésenként lőtt gólok</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Aktív játékosok</div>
            <div className="stat-value">{overallStats.activePlayerCount}</div>
            <div className="stat-subtitle">Részt vett a tornákon</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Összes turné</div>
            <div className="stat-value">{tournaments.length}</div>
            <div className="stat-subtitle">Játszott tornák</div>
          </div>
        </div>

        {/* Tournament Winners Section */}
        <div className="tournaments-section">
          <h2 className="section-title">🏆 Tornagyőztesek</h2>
          <div className="tournament-winners-grid">
            {tournaments
              .filter((t) => t.winner)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((tournament, idx) => (
                <div className="tournament-winner-card" key={idx}>
                  <div className="winner-date">{tournament.date}</div>
                  <div className="winner-title">{tournament.title}</div>
                  <div className="podium">
                    {/* Silver */}
                    {tournament.runnerUp && (
                      <div className="podium-position silver">
                        <div className="medal">🥈</div>
                        <div className="position-name">{tournament.runnerUp}</div>
                      </div>
                    )}
                    {/* Gold */}
                    <div className="podium-position gold">
                      <div className="medal">🥇</div>
                      <div className="position-name">{tournament.winner}</div>
                    </div>
                    {/* Bronze */}
                    {tournament.thirdPlace && (
                      <div className="podium-position bronze">
                        <div className="medal">🥉</div>
                        <div className="position-name">{tournament.thirdPlace}</div>
                      </div>
                    )}
                  </div>
                  <div className="tournament-stats-small">
                    <div className="stat-row">
                      <span>Mérkőzések:</span>
                      <strong>{tournament.totalMatches}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Gólok:</span>
                      <strong>{tournament.totalGoals}</strong>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Player Statistics Table */}
        <div className="players-section">
          <h2 className="section-title">Játékos Statisztikák</h2>

          <div className="header-row">
            <div className="header-cell">Játékos</div>
            <div className="header-cell">Mérkőzés</div>
            <div className="header-cell">Győzelem</div>
            <div className="header-cell">Vereség</div>
            <div className="header-cell">Győzelmi %</div>
            <div className="header-cell">Gólkülönbség</div>
            <div className="header-cell">Tornák</div>
            <div className="header-cell">Érmek</div>
            <div className="header-cell">Átlag gól</div>
          </div>

          {sortedPlayers.map(([name, stats]) => {
            const winRate = ((stats.wins / stats.matches) * 100).toFixed(1);
            const goalDiff = stats.goalsFor - stats.goalsAgainst;
            const avgGoal = (stats.goalsFor / stats.matches).toFixed(1);
            const totalMedals = stats.goldMedals + stats.silverMedals + stats.bronzeMedals;

            return (
              <div className="player-row" key={name}>
                <div className="player-name">{name}</div>
                <div className="stat-cell">{stats.matches}</div>
                <div className="stat-cell wins">{stats.wins}</div>
                <div className="stat-cell losses">{stats.losses}</div>
                <div className="stat-cell winrate">{winRate}%</div>
                <div className="stat-cell">{goalDiff > 0 ? '+' : ''}{goalDiff}</div>
                <div className="stat-cell">{stats.tournaments.length}</div>
                <div className="stat-cell medals">
                  {stats.goldMedals > 0 && <span className="medal-badge gold">🥇 {stats.goldMedals}</span>}
                  {stats.silverMedals > 0 && <span className="medal-badge silver">🥈 {stats.silverMedals}</span>}
                  {stats.bronzeMedals > 0 && <span className="medal-badge bronze">🥉 {stats.bronzeMedals}</span>}
                  {totalMedals === 0 && <span className="medal-badge empty">-</span>}
                </div>
                <div className="stat-cell">{avgGoal}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
