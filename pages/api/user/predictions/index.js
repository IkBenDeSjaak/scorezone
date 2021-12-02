import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const uid = req.session.user.id
        const { fromDate } = req.query

        const fromDateAsDate = new Date(fromDate)
        const tillDateAsDate = new Date(fromDateAsDate)
        tillDateAsDate.setDate(fromDateAsDate.getDate() + 6)

        if (!uid) {
          return res.status(401).end()
        } else if (!fromDate) {
          return res.status(400).json({ message: 'Missing fromDate parameter in request' })
        }

        const predictions = await getUserPredictionsData(uid, fromDateAsDate, tillDateAsDate)

        res.status(200).json(predictions)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}

export async function getUserPredictionsData (userId, fromDate, tillDate) {
  const leagues = await querydb(
    `
    SELECT L.LeagueId, L.LeagueName
    FROM Leagues L 
    INNER JOIN UserLeagues UL ON L.LeagueId = UL.LeagueId 
    WHERE UL.UserId = ?
    `,
    userId
  )

  // 1. User predicted and a match result is available
  // 2. User didn't predict and there is a match result available
  // 3. User didn't predict and there is no match result from the match
  const predictions = await querydb(
    `
    SELECT M.MatchId, M.LeagueId, M.StartTime AS StartDateTime, (SELECT TeamName FROM Teams WHERE TeamId = M.HomeTeam) as HomeTeam, (SELECT TeamImage FROM Teams WHERE TeamId = M.HomeTeam) AS HomeTeamImage, (SELECT TeamName FROM Teams WHERE TeamId = M.AwayTeam) as AwayTeam, (SELECT TeamImage FROM Teams WHERE TeamId = M.AwayTeam) AS AwayTeamImage, MR.GoalsHomeTeam, MR.GoalsAwayTeam, MP.GoalsHomeTeam AS GoalsHomeTeamPrediction, MP.GoalsAwayTeam AS GoalsAwayTeamPrediction, CASE
      WHEN (MR.GoalsHomeTeam IS NULL OR MR.GoalsAwayTeam IS NULL) THEN NULL
      WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam AND MP.GoalsAwayTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 18 AND PSOP.StrategyId = 5)
      WHEN (MP.GoalsHomeTeam = MP.GoalsAwayTeam AND MR.GoalsHomeTeam = MR.GoalsAwayTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 19 AND PSOP.StrategyId = 5)
      WHEN ((MP.GoalsHomeTeam > MP.GoalsAwayTeam AND MR.GoalsHomeTeam > MR.GoalsAwayTeam) OR (MP.GoalsAwayTeam > MP.GoalsHomeTeam AND MR.GoalsAwayTeam > MR.GoalsHomeTeam)) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 20 AND PSOP.StrategyId = 5)
      WHEN (MP.GoalsHomeTeam = MR.GoalsHomeTeam) THEN (SELECT DISTINCT PSOP.Points FROM PointsStrategiesOptionPoints PSOP INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy WHERE PSOP.OptionId = 21 AND PSOP.StrategyId = 5)
      ELSE 0
    END AS Points
    FROM Matches M
    LEFT JOIN MatchResults MR ON M.MatchId = MR.MatchId
    LEFT JOIN MatchPredictions MP ON M.MatchId = MP.MatchId
    INNER JOIN UserLeagues UL ON M.LeagueId = UL.LeagueId
    WHERE MP.UserId = ? AND M.StartTime BETWEEN ? AND ?
    GROUP BY M.MatchId
    UNION
    SELECT M.MatchId, M.LeagueId, M.StartTime AS StartDateTime, (SELECT TeamName FROM Teams WHERE TeamId = M.HomeTeam) as HomeTeam, (SELECT TeamImage FROM Teams WHERE TeamId = M.HomeTeam) AS HomeTeamImage, (SELECT TeamName FROM Teams WHERE TeamId = M.AwayTeam) as AwayTeam, (SELECT TeamImage FROM Teams WHERE TeamId = M.AwayTeam) AS AwayTeamImage, MR.GoalsHomeTeam, MR.GoalsAwayTeam, NULL AS GoalsHomeTeamPrediction, NULL AS GoalsAwayTeamPrediction, 0 AS Points
    FROM Matches M
    LEFT JOIN MatchResults MR ON M.MatchId = MR.MatchId
    LEFT JOIN MatchPredictions MP ON M.MatchId = MP.MatchId
    INNER JOIN UserLeagues UL ON M.LeagueId = UL.LeagueId
    WHERE M.MatchId NOT IN (SELECT DISTINCT MatchId FROM MatchPredictions WHERE UserId = ?) AND M.MatchId IN (SELECT DISTINCT MatchId FROM MatchResults) AND M.StartTime BETWEEN ? AND ?
    GROUP BY M.MatchId
    UNION
    SELECT M.MatchId, M.LeagueId, M.StartTime AS StartDateTime, (SELECT TeamName FROM Teams WHERE TeamId = M.HomeTeam) as HomeTeam, (SELECT TeamImage FROM Teams WHERE TeamId = M.HomeTeam) AS HomeTeamImage, (SELECT TeamName FROM Teams WHERE TeamId = M.AwayTeam) as AwayTeam, (SELECT TeamImage FROM Teams WHERE TeamId = M.AwayTeam) AS AwayTeamImage, NULL AS GoalsHomeTeam, NULL AS GoalsAwayTeam, NULL AS GoalsHomeTeamPrediction, NULL AS GoalsAwayTeamPrediction, NULL AS Points
    FROM Matches M
    LEFT JOIN MatchResults MR ON M.MatchId = MR.MatchId
    LEFT JOIN MatchPredictions MP ON M.MatchId = MP.MatchId
    INNER JOIN UserLeagues UL ON M.LeagueId = UL.LeagueId
    WHERE M.MatchId NOT IN (SELECT DISTINCT MatchId FROM MatchPredictions WHERE UserId = ?) AND M.MatchId NOT IN (SELECT DISTINCT MatchId FROM MatchResults) AND M.StartTime BETWEEN ? AND ?
    GROUP BY M.MatchId
    ORDER BY LeagueId, StartDateTime ASC
    `,
    [userId, fromDate.toISOString(), tillDate.toISOString(), userId, fromDate.toISOString(), tillDate.toISOString(), userId, fromDate.toISOString(), tillDate.toISOString()]
  )

  const predictionsPerLeague = {}

  for (const l of leagues) {
    predictionsPerLeague[`${l.LeagueName}`] = predictions.filter((p) => p.LeagueId === l.LeagueId)
  }

  return predictionsPerLeague
}
