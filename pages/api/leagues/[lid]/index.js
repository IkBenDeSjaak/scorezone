import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all available seasons from a league
      try {
        const { lid } = req.query

        if (!lid) {
          return res.status(400).json({ message: 'Missing LeagueId in request' })
        }

        const results = await getLeagueData(lid)

        if (!results) {
          return res.status(404).json({ message: 'This league does not exist' })
        }

        res.status(200).json(results)
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}

export async function getLeagueData (league) {
  const results = await querydb(
    `
    SELECT LeagueId, LeagueName, (SELECT COUNT(UserId) AS UserAmount FROM Users WHERE UserId IN (SELECT UserId FROM UserLeagues WHERE LeagueId = ?)) AS Participants
    FROM Leagues
    WHERE LeagueId = ?
    `,
    [league, league]
  )

  return results[0]
}
