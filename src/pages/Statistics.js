import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import Data from '../data/Data';
import '../styles/stats.scss';

const CHART_COLORS = ['#667eea', '#764ba2', '#5a67d8', '#9f7aea', '#4c51bf', '#b794f4', '#7f9cf5', '#6b46c1'];
const LINE_COLORS = [
  '#667eea', '#e74c3c', '#27ae60', '#f39c12', '#764ba2',
  '#16a085', '#e84393', '#2980b9', '#d35400', '#8e44ad',
];

// Selectable metrics for the tournament-by-tournament performance chart.
const PERFORMANCE_METRICS = {
  winrate: {
    label: 'Győzelmi %',
    unit: '%',
    domain: [0, 100],
    compute: (s) => (s.m ? Math.round((s.w / s.m) * 100) : null),
  },
  ppg: {
    label: 'Pont / meccs',
    unit: '',
    domain: [0, 3],
    compute: (s) => (s.m ? Number(((s.w * 3 + s.d) / s.m).toFixed(2)) : null),
  },
  gd: {
    label: 'Gólkülönbség',
    unit: '',
    domain: ['auto', 'auto'],
    compute: (s) => (s.m ? s.gf - s.ga : null),
  },
  goals: {
    label: 'Lőtt gól',
    unit: '',
    domain: [0, 'auto'],
    compute: (s) => (s.m ? s.gf : null),
  },
};

// Rich tooltip for the multi-line performance chart: title + ranked players.
function PerformanceTooltip({ active, payload, unit = '' }) {
  if (!active || !payload || !payload.length) return null;
  const title = payload[0]?.payload?.title || payload[0]?.payload?.name;
  const rows = payload
    .filter((p) => p.value !== undefined && p.value !== null)
    .sort((a, b) => b.value - a.value);
  if (!rows.length) return null;

  return (
    <div className="custom-tooltip">
      <div className="tooltip-title">{title}</div>
      <div className="tooltip-rows">
        {rows.map((r, i) => (
          <div className={`tooltip-row${i === 0 ? ' leader' : ''}`} key={r.dataKey}>
            <span className="tooltip-label">
              <span className="dot" style={{ background: r.color }} />
              {r.name}
            </span>
            <span className="tooltip-value">{r.value}{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact tooltip for the single-series bar charts.
function BarTooltip({ active, payload, label, titleKey, valueLabel = '' }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const title = titleKey ? item.payload[titleKey] : label;
  const color = item.payload.fill || item.color || '#667eea';

  return (
    <div className="custom-tooltip">
      <div className="tooltip-title">{title}</div>
      <div className="tooltip-row">
        <span className="tooltip-label">
          <span className="dot" style={{ background: color }} />
          {valueLabel}
        </span>
        <span className="tooltip-value">{item.value}</span>
      </div>
    </div>
  );
}

function createPlayer() {
  return {
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
    resultsLog: [],
  };
}

function Statistics() {
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalMatches: 0,
    totalGoals: 0,
    avgGoalsPerMatch: 0,
    activePlayerCount: 0,
    biggestWinMargin: 0,
  });
  const [playerRecords, setPlayerRecords] = useState([]);
  const [matchRecords, setMatchRecords] = useState([]);
  const [topScorersChart, setTopScorersChart] = useState([]);
  const [goalsPerTournamentChart, setGoalsPerTournamentChart] = useState([]);
  const [performanceChart, setPerformanceChart] = useState({ tournaments: [], players: [] });
  const [selectedMetric, setSelectedMetric] = useState('winrate');
  const [hiddenPlayers, setHiddenPlayers] = useState([]);

  const togglePlayer = (name) => {
    setHiddenPlayers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        await Data.fetchTournaments();
        // Process chronologically so win-streaks are accurate.
        const tournamentsData = [...Data.tournaments].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const playerStatsMap = {};
        const processedTournaments = [];
        const allMatches = []; // flat list for match-level records

        const ensure = (name) => {
          if (!playerStatsMap[name]) playerStatsMap[name] = createPlayer();
          return playerStatsMap[name];
        };

        // Shared accounting for a single played match.
        const recordMatch = (tournament, playerAName, playerBName, scoreA, scoreB, oddsA, oddsB, stage) => {
          const a = ensure(playerAName);
          const b = ensure(playerBName);

          a.tournaments.add(tournament.title);
          b.tournaments.add(tournament.title);
          a.matches++;
          b.matches++;
          a.goalsFor += scoreA;
          a.goalsAgainst += scoreB;
          b.goalsFor += scoreB;
          b.goalsAgainst += scoreA;

          if (scoreA > scoreB) {
            a.wins++; b.losses++;
            a.resultsLog.push('W'); b.resultsLog.push('L');
          } else if (scoreB > scoreA) {
            b.wins++; a.losses++;
            b.resultsLog.push('W'); a.resultsLog.push('L');
          } else {
            a.draws++; b.draws++;
            a.resultsLog.push('D'); b.resultsLog.push('D');
          }

          allMatches.push({
            tournamentTitle: tournament.title,
            date: tournament.date,
            playerAName,
            playerBName,
            scoreA,
            scoreB,
            oddsA,
            oddsB,
            stage,
          });
        };

        tournamentsData.forEach((tournament) => {
          const tournamentStats = {
            title: tournament.title,
            date: tournament.date,
            winner: null,
            runnerUp: null,
            thirdPlace: null,
            totalMatches: 0,
            totalGoals: 0,
          };

          const nameOf = (id) => {
            const p = tournament.players.find((pl) => pl.id === id);
            return p ? p.name : '';
          };

          // Track group stage stats separately to determine winner if no knockout
          const groupStageStats = {};

          // Process group stage matches
          (tournament.groups || []).forEach((group) => {
            (group.matches || []).forEach((match) => {
              if (match.scoreA !== '' && match.scoreB !== '') {
                const scoreA = parseInt(match.scoreA);
                const scoreB = parseInt(match.scoreB);
                const playerAName = nameOf(match.playerAId);
                const playerBName = nameOf(match.playerBId);

                if (playerAName && playerBName) {
                  recordMatch(tournament, playerAName, playerBName, scoreA, scoreB, match.oddsA, match.oddsB, 'group');

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
                    groupStageStats[playerAName].wins++;
                    groupStageStats[playerBName].losses++;
                  } else if (scoreB > scoreA) {
                    groupStageStats[playerBName].wins++;
                    groupStageStats[playerAName].losses++;
                  } else {
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
                const playerAName = nameOf(match.playerAId);
                const playerBName = nameOf(match.playerBId);

                if (playerAName && playerBName) {
                  recordMatch(tournament, playerAName, playerBName, scoreA, scoreB, match.oddsA, match.oddsB, round.name);

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
                }
              }
            });
          });

          // If no knockout stage, determine winner from group stage
          if (!tournamentStats.winner && Object.keys(groupStageStats).length > 0) {
            const sortedByStandings = Object.entries(groupStageStats)
              .map(([name, stats]) => {
                const points = stats.wins * 3 + stats.draws;
                const goalsFor = playerStatsMap[name]?.goalsFor || 0;
                const goalsAgainst = playerStatsMap[name]?.goalsAgainst || 0;
                const goalDiff = goalsFor - goalsAgainst;
                return { name, points, goalDiff, goalsFor, stats };
              })
              .sort((a, b) => {
                if (a.points !== b.points) return b.points - a.points;
                if (a.goalDiff !== b.goalDiff) return b.goalDiff - a.goalDiff;
                return b.goalsFor - a.goalsFor;
              });

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
            playerStatsMap[tournamentStats.winner].goldMedals++;
            if (tournamentStats.runnerUp) {
              playerStatsMap[tournamentStats.runnerUp].silverMedals++;
            }
            if (tournamentStats.thirdPlace) {
              playerStatsMap[tournamentStats.thirdPlace].bronzeMedals++;
            }
          }

          // Only count tournaments that actually have results
          if (tournamentStats.totalMatches > 0) {
            processedTournaments.push(tournamentStats);
          }
        });

        // Compute longest win streak + convert sets to arrays
        Object.keys(playerStatsMap).forEach((name) => {
          const p = playerStatsMap[name];
          p.tournaments = Array.from(p.tournaments);

          let best = 0;
          let current = 0;
          p.resultsLog.forEach((r) => {
            if (r === 'W') {
              current++;
              if (current > best) best = current;
            } else {
              current = 0;
            }
          });
          p.longestWinStreak = best;
        });

        // Sort players Olympic-style: gold, then silver, then bronze, then win rate
        const sorted = Object.entries(playerStatsMap).sort((a, b) => {
          if (a[1].goldMedals !== b[1].goldMedals) return b[1].goldMedals - a[1].goldMedals;
          if (a[1].silverMedals !== b[1].silverMedals) return b[1].silverMedals - a[1].silverMedals;
          if (a[1].bronzeMedals !== b[1].bronzeMedals) return b[1].bronzeMedals - a[1].bronzeMedals;
          const winRateA = (a[1].wins / a[1].matches) * 100;
          const winRateB = (b[1].wins / b[1].matches) * 100;
          return winRateB - winRateA;
        });

        // Overall stats
        const totalMatches = allMatches.length;
        const totalGoals = allMatches.reduce((sum, m) => sum + m.scoreA + m.scoreB, 0);

        // ----- Match-level records -----
        const highestScoring = allMatches.reduce(
          (best, m) => (best && best.scoreA + best.scoreB >= m.scoreA + m.scoreB ? best : m),
          null
        );
        const biggestWin = allMatches.reduce(
          (best, m) => {
            const margin = Math.abs(m.scoreA - m.scoreB);
            if (margin === 0) return best;
            if (!best) return m;
            return Math.abs(best.scoreA - best.scoreB) >= margin ? best : m;
          },
          null
        );
        // Biggest upset: a decided match where the winner had the higher (underdog) odds.
        let biggestUpset = null;
        allMatches.forEach((m) => {
          if (m.oddsA == null || m.oddsB == null || m.scoreA === m.scoreB) return;
          const winnerIsA = m.scoreA > m.scoreB;
          const winnerOdds = winnerIsA ? m.oddsA : m.oddsB;
          const loserOdds = winnerIsA ? m.oddsB : m.oddsA;
          if (winnerOdds > loserOdds) {
            if (!biggestUpset || winnerOdds > biggestUpset.winnerOdds) {
              biggestUpset = {
                winner: winnerIsA ? m.playerAName : m.playerBName,
                loser: winnerIsA ? m.playerBName : m.playerAName,
                scoreW: winnerIsA ? m.scoreA : m.scoreB,
                scoreL: winnerIsA ? m.scoreB : m.scoreA,
                winnerOdds,
                tournamentTitle: m.tournamentTitle,
              };
            }
          }
        });

        const fmtScore = (m) =>
          m ? `${m.playerAName} ${m.scoreA}–${m.scoreB} ${m.playerBName}` : '-';

        const newMatchRecords = [
          highestScoring && {
            icon: '🥅',
            title: 'Legtöbb gól egy meccsen',
            value: `${highestScoring.scoreA + highestScoring.scoreB} gól`,
            detail: `${fmtScore(highestScoring)} · ${highestScoring.tournamentTitle}`,
          },
          biggestWin && {
            icon: '💥',
            title: 'Legnagyobb különbség',
            value: `${Math.abs(biggestWin.scoreA - biggestWin.scoreB)} gól`,
            detail: `${fmtScore(biggestWin)} · ${biggestWin.tournamentTitle}`,
          },
          biggestUpset && {
            icon: '🎲',
            title: 'Legnagyobb meglepetés (odds)',
            value: `${biggestUpset.winnerOdds.toFixed(2)}`,
            detail: `${biggestUpset.winner} ${biggestUpset.scoreW}–${biggestUpset.scoreL} ${biggestUpset.loser} · ${biggestUpset.tournamentTitle}`,
          },
        ].filter(Boolean);

        // ----- Player-level records -----
        const MIN_MATCHES = 5;
        const eligible = sorted.filter(([, s]) => s.matches >= MIN_MATCHES);
        const pickMax = (list, scoreFn) =>
          list.reduce((best, cur) => (!best || scoreFn(cur[1]) > scoreFn(best[1]) ? cur : best), null);

        const topScorer = pickMax(sorted, (s) => s.goalsFor);
        const bestWinRate = pickMax(eligible.length ? eligible : sorted, (s) => s.wins / s.matches);
        const bestDefense = (eligible.length ? eligible : sorted).reduce(
          (best, cur) =>
            !best || cur[1].goalsAgainst / cur[1].matches < best[1].goalsAgainst / best[1].matches ? cur : best,
          null
        );
        const mostTitles = pickMax(sorted, (s) => s.goldMedals);
        const longestStreak = pickMax(sorted, (s) => s.longestWinStreak);

        const newPlayerRecords = [
          mostTitles && mostTitles[1].goldMedals > 0 && {
            icon: '🏆',
            title: 'Legtöbb tornagyőzelem',
            value: mostTitles[0],
            detail: `${mostTitles[1].goldMedals} aranyérem`,
          },
          topScorer && {
            icon: '⚽',
            title: 'Gólkirály',
            value: topScorer[0],
            detail: `${topScorer[1].goalsFor} gól · ${topScorer[1].matches} meccs`,
          },
          bestWinRate && {
            icon: '🎯',
            title: 'Legjobb győzelmi arány',
            value: `${((bestWinRate[1].wins / bestWinRate[1].matches) * 100).toFixed(0)}%`,
            detail: `${bestWinRate[0]} · ${bestWinRate[1].wins}/${bestWinRate[1].matches} meccs`,
          },
          bestDefense && {
            icon: '🛡️',
            title: 'Legjobb védelem',
            value: `${(bestDefense[1].goalsAgainst / bestDefense[1].matches).toFixed(2)}`,
            detail: `${bestDefense[0]} · kapott gól/meccs`,
          },
          longestStreak && longestStreak[1].longestWinStreak > 0 && {
            icon: '🔥',
            title: 'Leghosszabb győzelmi sorozat',
            value: `${longestStreak[1].longestWinStreak} győzelem`,
            detail: longestStreak[0],
          },
        ].filter(Boolean);

        // ----- Charts -----
        const topScorers = [...sorted]
          .sort((a, b) => b[1].goalsFor - a[1].goalsFor)
          .slice(0, 8)
          .map(([name, s]) => ({ name, goals: s.goalsFor }));

        const goalsPerTournament = processedTournaments.map((t) => ({
          name: t.date,
          title: t.title,
          goals: t.totalGoals,
        }));

        // ----- Tournament-by-tournament performance (raw per-tournament stats) -----
        // Per-tournament per-player W/M/D/GF/GA built from the flat match list;
        // the actual metric (win rate, points/game, …) is derived in the view.
        const perfByDate = {}; // date -> { playerName -> { w, m, d, gf, ga } }
        allMatches.forEach((mt) => {
          if (!perfByDate[mt.date]) perfByDate[mt.date] = {};
          const bucket = perfByDate[mt.date];
          if (!bucket[mt.playerAName]) bucket[mt.playerAName] = { w: 0, m: 0, d: 0, gf: 0, ga: 0 };
          if (!bucket[mt.playerBName]) bucket[mt.playerBName] = { w: 0, m: 0, d: 0, gf: 0, ga: 0 };
          const a = bucket[mt.playerAName];
          const b = bucket[mt.playerBName];
          a.m++; b.m++;
          a.gf += mt.scoreA; a.ga += mt.scoreB;
          b.gf += mt.scoreB; b.ga += mt.scoreA;
          if (mt.scoreA > mt.scoreB) a.w++;
          else if (mt.scoreB > mt.scoreA) b.w++;
          else { a.d++; b.d++; }
        });

        // Only chart recurring players (appeared in 2+ tournaments) to keep it readable.
        const recurringPlayers = sorted
          .filter(([, s]) => s.tournaments.length >= 2)
          .map(([name]) => name);

        const perfTournaments = processedTournaments.map((t) => ({
          name: t.date,
          title: t.title,
          stats: perfByDate[t.date] || {},
        }));

        setSortedPlayers(sorted);
        setTournaments(processedTournaments);
        setOverallStats({
          totalMatches,
          totalGoals,
          avgGoalsPerMatch: totalMatches ? (totalGoals / totalMatches).toFixed(2) : 0,
          activePlayerCount: sorted.length,
          biggestWinMargin: biggestWin ? Math.abs(biggestWin.scoreA - biggestWin.scoreB) : 0,
        });
        setMatchRecords(newMatchRecords);
        setPlayerRecords(newPlayerRecords);
        setTopScorersChart(topScorers);
        setGoalsPerTournamentChart(goalsPerTournament);
        setPerformanceChart({ tournaments: perfTournaments, players: recurringPlayers });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchAndProcessData();
  }, []);

  const metricConfig = PERFORMANCE_METRICS[selectedMetric];
  const performanceData = useMemo(() => {
    return performanceChart.tournaments.map((t) => {
      const row = { name: t.name, title: t.title };
      performanceChart.players.forEach((name) => {
        const s = t.stats[name];
        if (s) {
          const value = metricConfig.compute(s);
          if (value !== null) row[name] = value;
        }
      });
      return row;
    });
  }, [performanceChart, metricConfig]);

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
            <div className="stat-title">Összes torna</div>
            <div className="stat-value">{tournaments.length}</div>
            <div className="stat-subtitle">Játszott tornák</div>
          </div>
        </div>

        {/* Player Records / Highlights */}
        {playerRecords.length > 0 && (
          <div className="top-section">
            <h2 className="section-title">⭐ Csúcsteljesítmények</h2>
            <div className="top-players">
              {playerRecords.map((rec, idx) => (
                <div className="top-card" key={idx}>
                  <div className="medal">{rec.icon}</div>
                  <div className="top-card-title">{rec.title}</div>
                  <div className="top-card-value">{rec.value}</div>
                  <div className="top-card-detail">{rec.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match Records */}
        {matchRecords.length > 0 && (
          <div className="top-section">
            <h2 className="section-title">📋 Mérkőzés rekordok</h2>
            <div className="top-players">
              {matchRecords.map((rec, idx) => (
                <div className="top-card" key={idx}>
                  <div className="medal">{rec.icon}</div>
                  <div className="top-card-title">{rec.title}</div>
                  <div className="top-card-value">{rec.value}</div>
                  <div className="top-card-detail">{rec.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        {(topScorersChart.length > 0 || goalsPerTournamentChart.length > 0) && (
          <div className="charts-section">
            <h2 className="section-title">📊 Grafikonok</h2>

            {performanceChart.tournaments.length > 1 && performanceChart.players.length > 0 && (
              <div className="chart-container full-width">
                <div className="chart-header">
                  <div className="chart-title">Forma tornáról tornára</div>
                  <div className="metric-toggle">
                    {Object.entries(PERFORMANCE_METRICS).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        className={`metric-btn${selectedMetric === key ? ' active' : ''}`}
                        onClick={() => setSelectedMetric(key)}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="participant-toggle">
                  {performanceChart.players.map((name, index) => {
                    const color = LINE_COLORS[index % LINE_COLORS.length];
                    const active = !hiddenPlayers.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        className={`participant-btn${active ? ' active' : ''}`}
                        style={active ? { borderColor: color, color } : undefined}
                        onClick={() => togglePlayer(name)}
                      >
                        <span className="dot" style={{ background: active ? color : '#ccc' }} />
                        {name}
                      </button>
                    );
                  })}
                </div>
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart data={performanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={metricConfig.domain} unit={metricConfig.unit} tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={{ stroke: 'rgba(102, 126, 234, 0.3)', strokeWidth: 2 }}
                      content={<PerformanceTooltip unit={metricConfig.unit} />}
                    />
                    {performanceChart.players.map((name, index) => (
                      <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        stroke={LINE_COLORS[index % LINE_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        connectNulls
                        hide={hiddenPlayers.includes(name)}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="charts-grid">
              <div className="chart-container">
                <div className="chart-title">Legjobb góllövők</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topScorersChart} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(102, 126, 234, 0.08)' }}
                      content={<BarTooltip valueLabel="Gól" />}
                    />
                    <Bar dataKey="goals" name="Gól" radius={[6, 6, 0, 0]}>
                      {topScorersChart.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <div className="chart-title">Gólok tornánként</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={goalsPerTournamentChart} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(102, 126, 234, 0.08)' }}
                      content={<BarTooltip titleKey="title" valueLabel="Gól" />}
                    />
                    <Bar dataKey="goals" name="Gól" radius={[6, 6, 0, 0]}>
                      {goalsPerTournamentChart.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

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
            <div className="header-cell">Lőtt gól</div>
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
                <div className="stat-cell">{stats.goalsFor}</div>
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
