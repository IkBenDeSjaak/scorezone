import { isAdmin, querydb } from '../../../../../../../lib/db'
import { withSessionRoute } from '../../../../../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all matches from a season from a league
      try {
        const { lid, sid, mid } = req.query

        if (!lid || !sid || !mid) {
          return res.status(400).json({ message: 'Missing LeagueId, SeasonId or MatchId in request' })
        }

        const results = await querydb(
          `
          SELECT M.MatchId, M.HomeTeam, (SELECT TeamName FROM Teams WHERE TeamId = M.HomeTeam) AS HomeTeamName, M.AwayTeam, (SELECT TeamName FROM Teams WHERE TeamId = M.AwayTeam) AS AwayTeamName, M.MatchDay, M.StartTime
          FROM Matches M
          WHERE M.MatchId = ? AND M.SeasonId = ? AND M.LeagueId = ?
          `,
          [mid, sid, lid]
        )

        if (!results[0]) {
          return res.status(404).json({ message: 'Match not found' })
        }

        res.status(200).json(results[0])
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
      break
    case 'PUT':
      // Update match information
      try {
        const { lid, sid, mid } = req.query
        const { awayTeam, homeTeam, matchDay, matchStartTime } = req.body
        const uid = req.session.user?.id

        if (!lid || !sid || !mid || !awayTeam || !homeTeam || !matchDay || !matchStartTime) {
          return res.status(400).json({ message: 'Missing parameter in request' })
        }

        if (!await isAdmin(uid)) {
          return res.status(403).end()
        }

        await querydb(
          `
          UPDATE Matches
          SET HomeTeam = ?, AwayTeam = ?, MatchDay = ?, StartTime = ?
          WHERE MatchId = ? AND SeasonId = ? AND LeagueId = ?
          `,
          [homeTeam, awayTeam, matchDay, matchStartTime, mid, sid, lid]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}
