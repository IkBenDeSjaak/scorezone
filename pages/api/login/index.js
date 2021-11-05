import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'POST': {
      // const { username, password } = await req.body

      const username = 'TESTPERSOON'

      // get user from database then:

      const user = {
        id: 230,
        username: username
      }

      req.session.user = user

      await req.session.save()

      res.status(200).json({ name: `${username} is logged in` })
    }
  }
}
