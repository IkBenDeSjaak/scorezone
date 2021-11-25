import { query } from '../../../lib/db'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const results = await query(
          `
          SELECT L.LeagueId, L.LeagueName
          FROM Leagues L 
          `
        )

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
