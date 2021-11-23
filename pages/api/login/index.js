import bcrypt from 'bcrypt'
import { withSessionRoute } from '../../../lib/withSession'
import { query } from '../../../lib/db'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'POST': {
      const { username, password, rememberme } = await req.body

      if (!username || !password || rememberme === undefined) {
        return res.status(400).json({ message: 'Submit a username and password' })
      } else if (typeof (rememberme) !== 'boolean') {
        return res.status(400).json({ message: 'Bad request' })
      }

      const results = await query(
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
    }
  }
}
