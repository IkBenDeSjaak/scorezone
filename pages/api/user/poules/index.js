import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const uid = req.session.user?.id

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
        res.status(500).json({ message: error.message })
      }
  }
}
