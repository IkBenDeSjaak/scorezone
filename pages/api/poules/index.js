import { withSessionRoute } from '../../../lib/withSession'
import { querydb } from '../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'POST':
      // Create a new poule
      try {
        const uid = req.session.user?.id
        const { pouleName, leagueId, approveParticipants } = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!pouleName || !leagueId) {
          return res.status(400).json({ message: 'Missing parameter in request' })
        } else if (pouleName > 25) {
          return res.status(400).json({ message: 'The maximum length of the poule name is 25 characters' })
        }

        // Get current available season of specific league
        const season = await querydb(
          `
          SELECT LS.SeasonId 
          FROM LeagueSeasons LS
          INNER JOIN Seasons S ON LS.SeasonId = S.SeasonId
          WHERE LS.LeagueId = ? AND (CURRENT_DATE BETWEEN S.StartDate AND S.EndDate)
          `,
          leagueId
        )

        if (!season[0]) {
          return res.status(409).json({ message: 'There is no season available for this league' })
        }

        // Create new points strategy
        await querydb(
          `
          INSERT INTO PointsStrategies (Creator)
          VALUES (?)
          `,
          uid
        )

        // Get strategyId of created points strategy
        const strategyId = await querydb(
          `
          SELECT StrategyId
          FROM PointsStrategies
          WHERE Creator = ?
          ORDER BY StrategyId DESC
          LIMIT 1
          `,
          uid
        )

        if (!strategyId[0]) {
          return res.status(500).json({ message: 'Something went wrong while creating a new poule' })
        }

        // Give the newly created point strategy default points per option
        await querydb(
          `
          INSERT INTO PointsStrategiesOptionPoints(StrategyId, OptionId, Points) VALUES
          (?, 18, 10),
          (?, 19, 7),
          (?, 20, 6),
          (?, 21, 1),
          (?, 22, 1);
          `,
          [strategyId[0].StrategyId, strategyId[0].StrategyId, strategyId[0].StrategyId, strategyId[0].StrategyId, strategyId[0].StrategyId]
        )

        // Create the poule with the newly created strategy for this poule
        await querydb(
          `
          INSERT INTO Poules (PouleName, PouleLeague, PouleSeason, Creator, PointsStrategy, ApproveParticipants)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [pouleName, leagueId, season[0].SeasonId, uid, strategyId[0].StrategyId, approveParticipants]
        )

        res.status(201).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}
