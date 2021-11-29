import { withSessionRoute } from '../../../../../lib/withSession'
import { querydb } from '../../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'DELETE':
      try {
        const uid = req.session.user.id
        const { pid, ppid } = req.query

        if (!uid) {
          return res.status(401).end()
        } else if (!pid || !ppid) {
          return res.status(400).json({ message: 'Missing parameter in request' })
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
          FROM PouleParticipants
          WHERE PouleId = ? AND UserId = ?
          `,
          [pid, ppid]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'PUT':
      try {
        const uid = req.session.user.id
        const { pid, ppid } = req.query

        if (!uid) {
          return res.status(401).end()
        } else if (!pid || !ppid) {
          return res.status(400).json({ message: 'Missing parameter in request' })
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
          UPDATE PouleParticipants
          SET Approved = 1
          WHERE PouleId = ? AND UserId = ?
          `,
          [pid, ppid]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
