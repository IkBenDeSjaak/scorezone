import { querydb } from '../../../lib/db'

export default async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      // Get all available associations
      try {
        const results = await getAssociations()

        res.status(200).json(results)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}

export async function getAssociations () {
  return await querydb(
    `
    SELECT A.AssociationName, A.AssociationId
    FROM Associations A 
    ORDER BY A.AssociationName ASC
    `
  )
}
