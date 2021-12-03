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

        const results = await getLeagueSeasonsData(lid)

        res.status(200).json(results)
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}

export async function getLeagueSeasonsData (league) {
  const results = await querydb(
    `
    SELECT S.SeasonId, S.SeasonName 
    FROM Seasons S
    INNER JOIN LeagueSeasons LS ON S.SeasonId = LS.SeasonId
    WHERE LS.LeagueId = ?
    `,
    league
  )

  return results
}
