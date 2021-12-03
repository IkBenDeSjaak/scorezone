import { querydb } from '../../../lib/db'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all available leagues
      try {
        const results = await querydb(
          `
          SELECT L.LeagueId, L.LeagueName, (SELECT COUNT(UserId) AS UserAmount FROM Users WHERE UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = L.LeagueId)) AS Participants
          FROM Leagues L 
          ORDER BY L.LeagueName ASC
          `
        )

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
