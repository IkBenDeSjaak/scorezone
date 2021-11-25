import { withSessionRoute } from '../../../../lib/withSession'
import { query } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const uid = req.session.user.id

        if (!uid) {
          return res.status(401)
        }

        const results = await query(
          `
          SELECT L.LeagueId 
          FROM Leagues L 
          INNER JOIN UserLeagues UL ON L.LeagueId = UL.LeagueId 
          WHERE UL.UserId = ?
          `,
          uid
        )

        const leagueIds = results.map((league) => league.LeagueId)

        res.status(200).json(leagueIds)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'POST':
      try {
        const uid = req.session.user.id
        const leagueId = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!leagueId) {
          return res.status(400).json({ message: 'Missing leagueId in request' })
        }

        await query(
          `
          INSERT INTO UserLeagues (UserId, LeagueId) 
          VALUES (?, ?)
          `,
          [uid, leagueId]
        )

        res.status(201).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
