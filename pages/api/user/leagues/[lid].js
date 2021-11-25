import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'DELETE':
      try {
        const uid = req.session.user.id
        const leagueId = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!leagueId) {
          return res.status(400).json({ message: 'Missing leagueId in request' })
        }

        await querydb(
          `
          DELETE FROM UserLeagues
          WHERE UserId = ? AND LeagueId = ?
          `,
          [uid, leagueId]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
