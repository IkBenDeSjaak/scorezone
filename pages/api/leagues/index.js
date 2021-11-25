import { querydb } from '../../../lib/db'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const results = await querydb(
          `
          SELECT L.LeagueId, L.LeagueName
          FROM Leagues L 
          ORDER BY L.LeagueName ASC
          `
        )

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
  }
}
