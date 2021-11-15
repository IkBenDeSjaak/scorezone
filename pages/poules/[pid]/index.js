import styles from './Poule.module.css'

import Link from 'next/link'
import { withSessionSsr } from '../../../lib/withSession'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'

export default function Poule ({ test }) {
  const router = useRouter()
  const { pid } = router.query
  console.log(test)


  return (
    <>
      <Layout>
        <p className={styles.backButton}>
          <Link href='/poules'>
            <a>← Back to poules</a>
          </Link>
        </p>
        <h1 className={styles.pouleName}>baRENDDRECCHT</h1>
        <p className={styles.inviteText}>Invite people for this poule with the following link: <span>https://scorezone.nl/poules/{pid}?joincode=aiduch6732cnjsfcts7</span></p>
        <h2>Positions</h2>
        <div class={styles.standings}>
          <table>
            <thead>
              <tr>
                <th className={styles.standingsPos} scope='col'>Pos</th>
                <th className={styles.standingsUser} scope='col'>User</th>
                <th className={styles.standingsName} scope='col'>Name</th>
                <th className={styles.standingsPoints} scope='col'>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Sjaakie</td>
                <td className={styles.standingsName}>Sjaak Kok</td>
                <td>243</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Bertassssdklaasasdasdasdasdasdasddasdasdsjd</td>
                <td className={styles.standingsName}>Bert de Knaap</td>
                <td>244</td>
              </tr>
              <tr>
                <td>333</td>
                <td>AAaART</td>
                <td className={styles.standingsName}>AArt stoktatat</td>
                <td>2444</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.button}><Link href={`./${pid}/settings`}><a>Settings</a></Link></p>
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  params,
  req,
  res
}) {
  const pid = params.pid
  const user = req.session.user

  console.log(pid)

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
