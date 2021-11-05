import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      if (req.session.user) {
        // in a real world application you might read the user id from the session and then do a database request
        // to get more information on the user if needed
        res.json({
          ...req.session.user,
          isLoggedIn: true
        })
      } else {
        res.json({
          isLoggedIn: false
        })
      }
  }
}