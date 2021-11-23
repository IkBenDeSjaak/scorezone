import { query } from '../../../lib/db'
import bcrypt from 'bcrypt'

export default async function handler (req, res) {
  switch (req.method) {
    case 'POST': {
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

      const hashedPassword = await bcrypt.hash(password, 12)

      await query(
        `
        INSERT INTO Users (Email, Username, Password, Role, HidePredictions) 
        VALUES (?, ?, ?, ?, ?)
        `,
        [email, username, hashedPassword, 'User', 0]
      )

      res.status(200).json({ name: `${username} succesfully signed up` })
    }
  }
}
