import { withSessionRoute } from '../../../lib/withSession'
import { querydb } from '../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const uid = req.session.user?.id
        const { season } = req.query

        if (isNaN(season)) {
          return res.status(400).json({ message: 'Received invalid season' })
        }

        const results = await getRankingsData(uid, season)

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}

export async function getRankingsData (uid = undefined, season) {
  if (uid) {
    // Select poule info including points for this user
    const leagues = await querydb(
      `
      SELECT DISTINCT L.LeagueId, L.LeagueName, (SELECT COUNT(UserId) AS UserAmount FROM Users WHERE UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = L.LeagueId)) AS Participants, (SELECT COALESCE(SUM(CASE
        WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 18 AND PSOP.StrategyId = 5)
        WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 19 AND PSOP.StrategyId = 5)
        WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 20 AND PSOP.StrategyId = 5)
        WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 21 AND PSOP.StrategyId = 5)
        WHEN (MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 22 AND PSOP.StrategyId = 5)
        ELSE 0
      END), 0)
      FROM Users U
      INNER JOIN MatchPredictions MP ON U.UserId =  MP.UserId
      INNER JOIN MatchResults MR ON MP.MatchId = MR.MatchId
      INNER JOIN Matches M ON MP.MatchId = M.MatchId
      WHERE U.UserId = ? AND M.LeagueId = L.LeagueId AND M.SeasonId = ? AND U.UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = L.LeagueId)
      ) AS Points
      FROM Leagues L
      INNER JOIN LeagueSeasons LS ON L.LeagueId = LS.LeagueId
      WHERE LS.SeasonId = ?
      `,
      [uid, season, season]
    )

    // Calculate position of logged in user by selecting points for other users and check how many have higher points
    for await (const l of leagues) {
      const allUsersFromLeague = await querydb(
        `
        SELECT U.UserId, COALESCE(SUM(CASE
          WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 18 AND PSOP.StrategyId = 5)
          WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 19 AND PSOP.StrategyId = 5)
          WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 20 AND PSOP.StrategyId = 5)
          WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 21 AND PSOP.StrategyId = 5)
          WHEN (MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 22 AND PSOP.StrategyId = 5)
          ELSE 0
        END), 0) AS Points
        FROM Users U
        INNER JOIN MatchPredictions MP ON U.UserId =  MP.UserId
        INNER JOIN MatchResults MR ON MP.MatchId = MR.MatchId
        INNER JOIN Matches M ON MP.MatchId = M.MatchId
        WHERE M.LeagueId = ? AND M.SeasonId = ?
        GROUP BY U.UserId
        UNION
        SELECT U.UserId, 0 AS Points
        FROM Users U
        WHERE U.UserId NOT IN (SELECT MP.UserId FROM MatchPredictions MP INNER JOIN Matches M ON MP.MatchId = M.MatchId WHERE M.LeagueId = ? AND M.SeasonId = ?)
        GROUP BY U.UserId
        ORDER BY Points DESC
        `,
        [l.LeagueId, season, l.LeagueId, season]
      )
  
      const usersWithHigherPoints = allUsersFromLeague.filter((user) => user.Points > l.Points).length
      l.Position = usersWithHigherPoints + 1
    }

    return leagues
  } else {
    const results = await querydb(
      `
      SELECT DISTINCT L.LeagueId, L.LeagueName, (SELECT COUNT(UserId) AS UserAmount FROM Users WHERE UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = L.LeagueId)) AS Participants
      FROM Leagues L
      INNER JOIN LeagueSeasons LS ON L.LeagueId = LS.LeagueId
      WHERE LS.SeasonId = ?
      `,
      season
    )
    return results
  }
}
