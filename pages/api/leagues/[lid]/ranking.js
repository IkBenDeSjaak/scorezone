import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get rankings from a specific league
      try {
        const { lid, page, season, sortCol } = req.query

        if (!lid) {
          return res.status(400).json({ message: 'Missing LeagueId in request' })
        } else if (page < 1) {
          return res.status(400).json({ message: 'Page can not be 0 or negative' })
        } else if (isNaN(page) || isNaN(lid) || isNaN(season)) {
          return res.status(400).json({ message: 'Received invalid page, league or season' })
        }

        const offset = (page - 1) * 25

        // 1. Users with predictions where als results are available
        // 2. Users didn't predict a match
        // 3. Users predicted a match but the result is not there yet
        const results = await querydb(
          `
          SELECT U.UserId, U.Username, COALESCE(SUM(CASE
            WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 1 AND PSOP.StrategyId = 1)
            WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 2 AND PSOP.StrategyId = 1)
            WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 3 AND PSOP.StrategyId = 1)
            WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 4 AND PSOP.StrategyId = 1)
            WHEN (MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP WHERE PSOP.OptionId = 5 AND PSOP.StrategyId = 1)
            ELSE 0
          END), 0) AS Points, COALESCE(SUM(CASE
            WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN 1
            WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN 1
            ELSE 0
          END), 0) AS WinnerCorrect
          FROM Users U
          INNER JOIN MatchPredictions MP ON U.UserId =  MP.UserId
          INNER JOIN MatchResults MR ON MP.MatchId = MR.MatchId
          INNER JOIN Matches M ON MP.MatchId = M.MatchId
          WHERE M.LeagueId = ? AND M.SeasonId = ? AND U.UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = ?)
          GROUP BY U.UserId
          UNION
          SELECT U.UserId, U.Username, 0 AS Points, 0 AS WinnerCorrect
          FROM Users U
          WHERE U.UserId NOT IN (SELECT MP.UserId FROM MatchPredictions MP INNER JOIN Matches M ON MP.MatchId = M.MatchId WHERE M.LeagueId = ? AND M.SeasonId = ?) AND U.UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = ?)
          GROUP BY U.UserId
          UNION
          SELECT U.UserId, U.Username, 0 AS Points, 0 AS WinnerCorrect
          FROM Users U
          INNER JOIN MatchPredictions MP ON U.UserId = MP.UserId
          INNER JOIN Matches M ON MP.MatchId = M.MatchId
          WHERE M.LeagueId = ? AND M.SeasonId = ? AND U.UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = ?) AND M.MatchId NOT IN (SELECT DISTINCT MatchId FROM MatchResults)
          GROUP BY U.UserId
          ORDER BY ? DESC, Username ASC
          LIMIT 25 OFFSET ?
          `,
          [lid, season, lid, lid, season, lid, lid, season, lid, (sortCol !== 'undefined') ? sortCol : 'Points', offset]
        )

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}
