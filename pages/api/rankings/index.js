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
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}

export async function getRankingsData (uid = undefined, season) {
  if (uid) {
    const results = await querydb(
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

    return results
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
