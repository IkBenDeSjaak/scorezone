import { withSessionRoute } from '../../../lib/withSession'
import { querydb } from '../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const userId = req.session.user?.id
        const { uid } = req.query

        if (!uid) {
          return res.status(401).end()
        } else if (parseInt(uid) !== userId) {
          return res.status(403).end()
        }

        const results = await querydb(
          `
          SELECT Email, Username, FirstName, LastName, HidePredictions
          FROM Users
          WHERE UserId = ?
          `,
          uid
        )

        res.status(200).json(results[0])
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
      break
    case 'PUT':
      try {
        const userId = req.session.user?.id
        const { uid } = req.query
        const { Email, Username, FirstName, LastName, HidePredictions } = req.body

        if (!uid) {
          return res.status(401).end()
        } else if (parseInt(uid) !== userId) {
          return res.status(403).end()
        } else if (!Email || !Username || HidePredictions === undefined) {
          return res.status(400).json({ message: 'Fill in all required fields' })
        } else if (Username.length < 6 || Username.length > 20) {
          return res.status(400).json({ message: 'Username does not meet the required length' })
        } else if (Email.length > 64) {
          return res.status(400).json({ message: 'Email is too long' })
        } else if (FirstName?.length > 50) {
          return res.status(400).json({ message: 'First name is too long' })
        } else if (LastName?.length > 50) {
          return res.status(400).json({ message: 'Last name is too long' })
        }

        const usernameResults = await querydb(
          'SELECT Username FROM Users WHERE Username = ? AND Username NOT IN (SELECT Username FROM Users WHERE UserId = ?)',
          [Username, uid]
        )

        const emailResults = await querydb(
          'SELECT Email FROM Users WHERE Email = ? AND Email NOT IN (SELECT Email FROM Users WHERE UserId = ?)',
          [Email, uid]
        )

        if (usernameResults[0]?.Username && emailResults[0]?.Email) {
          return res.status(409).json({ message: 'Username and email already exist' })
        } else if (usernameResults[0]?.Username) {
          return res.status(409).json({ message: 'Username already exists' })
        } else if (emailResults[0]?.Email) {
          return res.status(409).json({ message: 'Email already exists' })
        }

        await querydb(
          `
          UPDATE Users
          SET Email = ?, Username = ?, FirstName = ?, LastName = ?, HidePredictions = ?
          WHERE UserId = ?
          `,
          [Email, Username, FirstName, LastName, HidePredictions, uid]
        )

        res.status(200).end()
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
  }
}
