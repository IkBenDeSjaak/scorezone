import { withSessionRoute } from '../../../../lib/withSession'
import { querydb } from '../../../../lib/db'
import { getPouleInfoData } from '.'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const uid = req.session.user?.id
        const { pid } = req.query

        if (!uid) {
          return res.status(401).end()
        } else if (!pid) {
          return res.status(400).json({ message: 'Missing PouleId in request' })
        }

        const pouleInfo = await getPouleInfoData(pid)

        // Check if person who is using this route is the same person who created this poule
        if (pouleInfo[0].Creator !== uid) {
          return res.status(403).end()
        }

        const results = await querydb(
          `
          SELECT PP.UserId, U.Username, U.FirstName, U.LastName, PP.Approved
          FROM PouleParticipants PP
          INNER JOIN Users U ON PP.UserId = U.UserId
          WHERE PP.PouleId = ? AND PP.Approved = 0
          `,
          pid
        )

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}
