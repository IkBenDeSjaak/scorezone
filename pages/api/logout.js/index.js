import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    case 'POST':
      req.session.destroy()
      res.status(200).json({
        isLoggedIn: false
      })
  }
}
