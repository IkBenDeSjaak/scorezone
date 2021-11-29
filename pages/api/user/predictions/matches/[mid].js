import { withSessionRoute } from '../../../../../lib/withSession'
import { querydb } from '../../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'PUT':
      try {
        const uid = req.session.user.id
        const { mid } = req.query
        const { goalsHomeTeam, goalsAwayTeam } = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!mid) {
          return res.status(400).json({ message: 'Missing MatchId in request' })
        } else if (goalsHomeTeam === null || goalsAwayTeam === null) {
          return res.status(400).json({ message: 'Missing request body' })
        }

        await querydb(
          `
          INSERT INTO MatchPredictions (UserId, MatchId, GoalsHomeTeam, GoalsAwayTeam)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY
          UPDATE GoalsHomeTeam = ?, GoalsAwayTeam = ?, SubmitTime = CURRENT_TIMESTAMP
          `,
          [uid, mid, goalsHomeTeam, goalsAwayTeam, goalsHomeTeam, goalsAwayTeam]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
