import { isAdmin, querydb } from '../../../lib/db'
import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // Get all available leagues
      try {
        const results = await getLeagues()

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
      break
    case 'POST':
      // Create new league
      try {
        const { leagueName, associationId } = req.body
        const uid = req.session.user?.id

        if (!await isAdmin(uid)) {
          return res.status(403).end()
        }

        await querydb(
          `
          INSERT INTO Leagues (LeagueName, AssociationId)
          VALUES (?, ?)
          `,
          [leagueName, associationId]
        )

        res.status(201).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}

export async function getLeagues() {
  const results = await querydb(
    `
    SELECT L.LeagueId, L.LeagueName, (SELECT COUNT(UserId) AS UserAmount FROM Users WHERE UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = L.LeagueId)) AS Participants
    FROM Leagues L 
    ORDER BY L.LeagueName ASC
    `
  )

  return results
}
