import { withSessionRoute } from '../../../../../lib/withSession'
import { isAdmin, querydb } from '../../../../../lib/db'

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
        res.status(500).json({ message: error.message })
      }
      break
    case 'POST':
      // Add season to a league
      try {
        const { lid } = req.query
        const { seasonId } = req.body
        const uid = req.session.user?.id

        if (!lid || !seasonId) {
          return res.status(400).json({ message: 'Missing parameter in request' })
        }

        if (!await isAdmin(uid)) {
          return res.status(403).end()
        }

        await querydb(
          `
          INSERT INTO LeagueSeasons (LeagueId, SeasonId)
          VALUES (?, ?)
          `,
          [lid, seasonId]
        )

        res.status(201).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
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
    ORDER BY S.SeasonId DESC
    `,
    league
  )

  return results
}
