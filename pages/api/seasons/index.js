import { isAdmin, querydb } from '../../../lib/db'
import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all available seasons
      try {
        const results = await getAllSeasonsData()

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
      break
    case 'POST':
      // Create new season
      try {
        const { seasonName, seasonStartDate, seasonEndDate } = req.body
        const uid = req.session.user?.id

        if (!await isAdmin(uid)) {
          return res.status(403).end()
        }

        await querydb(
          `
          INSERT INTO Seasons (SeasonName, StartDate, EndDate)
          VALUES (?, ?, ?)
          `,
          [seasonName, seasonStartDate, seasonEndDate]
        )

        res.status(201).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}

export async function getAllSeasonsData () {
  const results = await querydb(
    `
    SELECT SeasonId, SeasonName, StartDate, EndDate
    FROM Seasons
    ORDER BY SeasonId DESC
    `
  )

  return results
}
