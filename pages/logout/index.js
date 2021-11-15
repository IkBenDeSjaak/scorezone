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
  req,
  res
}) {
  const user = req.session.user

  // if user is logged in, log the user out

  // if (user === undefined) {
  //   res.setHeader("location", "/login");
  //   res.statusCode = 302;
  //   res.end();
  //   return {
  //     props: {
  //       user: { isLoggedIn: false, login: "", avatarUrl: "" },
  //     },
  //   };
  // }

  // return {
  //   props: { user: req.session.user },
  // };\

  return {
    props: {
      test: 'testtekst'
    } // will be passed to the page component as props
  }
}
)