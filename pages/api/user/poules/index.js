import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const uid = req.session.user.id

        if (!uid) {
          return res.status(401)
        }

        const results = await querydb(
          `
          SELECT DISTINCT P.PouleId, P.PouleName, S.SeasonName, L.LeagueName
          FROM Poules P 
          LEFT JOIN PouleParticipants PP ON P.PouleId = PP.PouleId 
          INNER JOIN Seasons S ON P.PouleSeason = S.SeasonId
          INNER JOIN Leagues L ON P.PouleLeague = L.LeagueId
          WHERE P.Creator = ? OR (PP.UserId = ? AND PP.Approved = 1)
          ORDER BY P.CreationTime DESC
          `,
          [uid, uid]
        )

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
      break
    case 'POST':
      try {
        const uid = req.session.user.id
        const { pouleName, leagueId, approveParticipants } = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (!pouleName || !leagueId) {
          return res.status(400).json({ message: 'Missing parameter in request' })
        } else if (pouleName > 25) {
          return res.status(400).json({ message: 'The maximum length of the poule name is 25 characters' })
        }

        const season = await querydb(
          `
          SELECT LS.SeasonId 
          FROM LeagueSeasons LS
          INNER JOIN Seasons S ON LS.SeasonId = S.SeasonId
          WHERE LS.LeagueId = ? AND (CURRENT_DATE BETWEEN S.StartDate AND S.EndDate)
          `,
          leagueId
        )

        if (!season[0]) {
          return res.status(409).json({ message: 'There is no season available for this league' })
        }

        await querydb(
          `
          INSERT INTO Poules (PouleName, PouleLeague, PouleSeason, Creator, PointsStrategy, ApproveParticipants)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [pouleName, leagueId, season[0].SeasonId, uid, 2, approveParticipants]
        )

        res.status(201).end()
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
