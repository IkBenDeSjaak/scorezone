import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    // Log the user out
    case 'POST':
      req.session.destroy()

      console.log("ik kom hier")
      res.status(200).json({
        isLoggedIn: false
      })
  }
}
