import { query } from '../../../lib/db'
import bcrypt from 'bcrypt'

export default async function handler (req, res) {
  switch (req.method) {
    case 'POST': {
      try {
        const { email, username, password } = req.body

        if (!email || !username || !password) {
          return res.status(400).json({ message: 'Fill in all required fields' })
        } else if (password.length < 8 || password.length > 50) {
          return res.status(400).json({ message: 'Password does not meet the required length' })
        } else if (username.length < 6) {
          return res.status(400).json({ message: 'Username does not meet the required length' })
        } else if (email.length > 64) {
          return res.status(400).json({ message: 'Email is too long' })
        }

        const usernameResults = await query(
          'SELECT Username FROM Users WHERE Username = ?',
          username
        )

        const emailResults = await query(
          'SELECT Email FROM Users WHERE Email = ?',
          email
        )

        if (usernameResults[0]?.Username && emailResults[0]?.Email) {
          return res.status(409).json({ message: 'Username and email already exist' })
        } else if (usernameResults[0]?.Username) {
          return res.status(409).json({ message: 'Username already exists' })
        } else if (emailResults[0]?.Email) {
          return res.status(409).json({ message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await query(
          `
          INSERT INTO Users (Email, Username, Password, Role, HidePredictions) 
          VALUES (?, ?, ?, ?, ?)
          `,
          [email, username, hashedPassword, 'User', 0]
        )

        res.status(200).json({ message: `${username} succesfully signed up` })
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }
}
