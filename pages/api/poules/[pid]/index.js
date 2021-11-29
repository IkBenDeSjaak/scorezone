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
          SELECT PouleName, ApproveParticipants 
          FROM Poules
          WHERE PouleId = ?
          `,
          pid
        )

        res.status(200).json(results[0])
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'PUT':
      try {
        const uid = req.session.user.id
        const { pid } = req.query
        const { PouleName, ApproveParticipants } = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!pid || !PouleName || ApproveParticipants === undefined) {
          return res.status(400).json({ message: 'Missing parameter in request' })
        } else if (PouleName > 25) {
          return res.status(400).json({ message: 'The maximum length of the poule name is 25 characters' })
        }

        const pouleCreator = await querydb(
          `
          SELECT Creator
          FROM Poules
          WHERE PouleId = ?
          `,
          pid
        )

        if (pouleCreator[0].Creator !== uid) {
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
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'DELETE':
      try {
        const uid = req.session.user.id
        const { pid } = req.query

        if (!uid) {
          return res.status(401).end()
        }

        const pouleCreator = await querydb(
          `
          SELECT Creator
          FROM Poules
          WHERE PouleId = ?
          `,
          pid
        )

        if (pouleCreator[0].Creator !== uid) {
          return res.status(403).end()
        }

        await querydb(
          `
          DELETE
          FROM Poules
          WHERE PouleId = ? AND Creator = ?
          `,
          [pid, uid]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
