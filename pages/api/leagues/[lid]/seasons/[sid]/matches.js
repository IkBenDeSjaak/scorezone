import { isAdmin, querydb } from '../../../../../../lib/db'
import { withSessionRoute } from '../../../../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all matches from a season from a league
      try {
        const { lid, sid } = req.query

        if (!lid || !sid) {
          return res.status(400).json({ message: 'Missing LeagueId or SeasonId in request' })
        }

        const results = await getMatchesFromLeagueSeason(lid, sid)

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
      break
    case 'POST':
      // Create new match
      try {
        const { lid, sid } = req.query
        const { awayTeam, homeTeam, matchDay, matchStartTime } = req.body
        const uid = req.session.user?.id

        if (!lid || !sid || !awayTeam || !homeTeam || !matchDay || !matchStartTime) {
          return res.status(400).json({ message: 'Missing parameter in request' })
        }

        if (!await isAdmin(uid)) {
          return res.status(403).end()
        }

        await querydb(
          `
          INSERT INTO Matches (LeagueId, SeasonId, HomeTeam, AwayTeam, MatchDay, StartTime)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [lid, sid, homeTeam, awayTeam, matchDay, matchStartTime]
        )

        res.status(201).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}

export async function getMatchesFromLeagueSeason (league, season) {
  const results = await querydb(
    `
    SELECT M.MatchId, M.HomeTeam, (SELECT TeamName FROM Teams WHERE TeamId = M.HomeTeam) AS HomeTeamName, M.AwayTeam, (SELECT TeamName FROM Teams WHERE TeamId = M.AwayTeam) AS AwayTeamName, M.MatchDay, M.StartTime
    FROM Matches M
    WHERE M.LeagueId = ? AND M.SeasonId = ?
    `,
    [league, season]
  )

  return results
}
