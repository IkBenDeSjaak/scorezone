export default function handler (req, res) {
  switch (req.method) {
    case 'POST': {
      // const { username, password, email } = await req.body

      const username = 'TESTPERSOONTJE'
      const password = 'PAASWOORD'

      // get user from database then:

      const user = {
        id: 230,
        username: username
      }

      res.status(200).json({ name: `${username} Signed up` })
    }
  }
}
