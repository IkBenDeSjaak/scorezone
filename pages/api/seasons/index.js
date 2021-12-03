import { querydb } from '../../../lib/db'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all available seasons
      try {
        const results = await getAllSeasonsData()

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}

export async function getAllSeasonsData() {
  const results = await querydb(
    `
    SELECT SeasonId, SeasonName
    FROM Seasons
    ORDER BY SeasonId DESC
    `
  )

  return results
}