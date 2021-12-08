import { withSessionSsr } from '../../lib/withSession'
import Layout from '../../components/Layout'

export default function Logout () {
  return (
    <>
      <Layout>
        <h1>Logout</h1>
        <p>You have successfully logged out of your account.</p>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req
}) {
  const user = req.session.user

  if (user) {
    req.session.destroy()
  }

  return {
    props: {}
  }
}
)
