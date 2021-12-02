import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { pid } = req.query

        if (!pid) {
          return res.status(400).json({ message: 'Missing PouleId in request' })
        }

        const results = await querydb(
          `
          SELECT PSOP.OptionId, PO.OptionName, PSOP.Points
          FROM PointsStrategiesOptionPoints PSOP
          INNER JOIN Poules P ON PSOP.StrategyId = P.PointsStrategy
          INNER JOIN PointsOptions PO ON PSOP.OptionId = PO.OptionId
          WHERE P.PouleId = ?
          ORDER BY PSOP.Points DESC
          `,
          pid
        )

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'PUT':
      try {
        const uid = req.session.user.id
        const { pid } = req.query
        const points = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!pid) {
          return res.status(400).json({ message: 'Missing PouleId in request' })
        } else if (!points) {
          return res.status(400).json({ message: 'Missing request body' })
        } else if (points.filter(p => (p.Points < 0 || p.Points > 20)).length > 0) {
          return res.status(400).json({ message: 'The maximum amount of points per option is 20' })
        }

        const pouleInfo = await querydb(
          `
          SELECT Creator, PointsStrategy
          FROM Poules
          WHERE PouleId = ?
          `,
          pid
        )

        // Check if person who is using this route is the same person who created this poule
        if (pouleInfo[0].Creator !== uid) {
          return res.status(403).end()
        }

        for (const p of points) {
          await querydb(
            `
            UPDATE PointsStrategiesOptionPoints
            SET Points = ?
            WHERE StrategyId = ? AND OptionId = ?
            `,
            [p.Points, pouleInfo[0].PointsStrategy, p.OptionId]
          )
        }

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
