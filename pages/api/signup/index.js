export default  function handler (req, res) {
  switch (req.method) {
    case 'POST': {
      const { email, username, password } = req.body

      // const username = 'TESTPERSOONTJE'
      // const password = 'PAASWOORD'

      const user = {
        id: 230,
        username: username
      }

      res.status(200).json({ name: `${email} ${username} ${password} Signed up` })
    }
  }
}
