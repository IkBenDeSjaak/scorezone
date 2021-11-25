import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'GET':
      if (req.session.user) {
        res.status(200).json({
          ...req.session.user,
          isLoggedIn: true
        })
      } else {
        res.status(200).json({
          isLoggedIn: false
        })
      }
  }
}
