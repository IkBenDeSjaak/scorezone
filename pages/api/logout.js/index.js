import { withSessionRoute } from '../../../lib/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  switch (req.method) {
    // Log the user out
    case 'POST':
      req.session.destroy()

      process.stdout._write("i come here")
      process.stdout._write(req)
      res.status(200).json({
        isLoggedIn: false
      })
  }
}
