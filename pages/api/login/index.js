import bcrypt from 'bcrypt'
import { withSessionRoute } from '../../../lib/withSession'
import { querydb } from '../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'POST': {
      // Log the user in
      try {
        const { username, password } = await req.body

        if (!username || !password) {
          return res.status(400).json({ message: 'Submit a username and password' })
        }

        const results = await querydb(
          `
          SELECT UserId, Password
          FROM Users
          WHERE Username = ?
          `,
          username
        )

        if (!results[0]) {
          return res.status(401).json({ message: 'Invalid username or password' })
        }

        if (results[0]?.Password) {
          const match = await bcrypt.compare(password, results[0].Password)

          if (match) {
            const user = {
              id: results[0].UserId,
              username: username
            }

            req.session.user = user
            await req.session.save()

            return res.status(200).json({ message: 'Valid username and password combination' })
          } else {
            return res.status(401).json({ message: 'Invalid username or password' })
          }
        } else {
          return res.status(401).json({ message: 'Invalid username or password' })
        }
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    }
  }
}
