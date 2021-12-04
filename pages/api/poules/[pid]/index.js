import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const uid = req.session.user?.id
        const { pid } = req.query

        if (!pid) {
          return res.status(400).json({ message: 'Missing PouleId in request' })
        }

        const results = await getPouleInfoData(pid)

        if (!results[0]) {
          return res.status(404).json({ message: 'This poule does not exist' })
        } else if (results[0].Creator !== uid) {
          return res.status(403).end()
        }

        res.status(200).json(results[0])
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
      break
    case 'PUT':
      try {
        const uid = req.session.user?.id
        const { pid } = req.query
        const { PouleName, ApproveParticipants } = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!pid || !PouleName || ApproveParticipants === undefined) {
          return res.status(400).json({ message: 'Missing parameter in request' })
        } else if (PouleName > 25) {
          return res.status(400).json({ message: 'The maximum length of the poule name is 25 characters' })
        }

        const pouleInfo = await getPouleInfoData(pid)

        // Check if person who is using this route is the same person who created this poule
        if (pouleInfo[0].Creator !== uid) {
          return res.status(403).end()
        }

        await querydb(
          `
          UPDATE Poules
          SET PouleName = ?, ApproveParticipants = ?
          WHERE PouleId = ? AND Creator = ?
          `,
          [PouleName, ApproveParticipants, pid, uid]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
      break
    case 'DELETE':
      try {
        const uid = req.session.user?.id
        const { pid } = req.query

        if (!uid) {
          return res.status(401).end()
        }

        const pouleInfo = await getPouleInfoData(pid)

        if (pouleInfo[0].Creator !== uid) {
          return res.status(403).end()
        }

        await querydb(
          `
          DELETE
          FROM PouleParticipants
          WHERE PouleId = ?
          `,
          pid
        )

        await querydb(
          `
          DELETE
          FROM Poules
          WHERE PouleId = ? AND Creator = ?
          `,
          [pid, uid]
        )

        await querydb(
          `
          DELETE
          FROM PointsStrategiesOptionPoints
          WHERE StrategyId = ?
          `,
          pouleInfo[0].PointsStrategy
        )

        await querydb(
          `
          DELETE
          FROM PointsStrategies
          WHERE StrategyId = ?
          `,
          pouleInfo[0].PointsStrategy
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}

export async function getPouleInfoData (pouleId) {
  const pouleInfo = await querydb(
    `
    SELECT PouleName, JoinCode, Creator, PointsStrategy, ApproveParticipants 
    FROM Poules
    WHERE PouleId = ?
    `,
    pouleId
  )

  return pouleInfo
}
