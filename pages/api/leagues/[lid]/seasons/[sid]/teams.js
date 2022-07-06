import { querydb } from '../../../../../../lib/db'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all teams from a season from a league
      try {
        const { lid, sid } = req.query

        if (!lid || !sid) {
          return res.status(400).json({ message: 'Missing LeagueId or SeasonId in request' })
        }

        const results = await getTeamsFromLeagueSeason(lid, sid)

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}

export async function getTeamsFromLeagueSeason (league, season) {
  const results = await querydb(
    `
    SELECT TIL.TeamId, (SELECT TeamName FROM Teams WHERE TeamId = TIL.TeamId) AS TeamName
    FROM TeamsInLeagues TIL
    WHERE TIL.LeagueId = ? AND TIL.SeasonId = ?
    ORDER BY TeamName
    `,
    [league, season]
  )

  return results
}
