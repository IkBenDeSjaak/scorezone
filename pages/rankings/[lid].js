import styles from './LeagueRanking.module.css'

import Link from 'next/link'
import { withSessionSsr } from '../../lib/withSession'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Pagination from '../../components/Pagination'

export default function LeagueRanking ({ test, page, amountOfPages }) {
  const router = useRouter()
  const { lid } = router.query
  console.log(test)
  console.log(lid)

  return (
    <>
      <Layout>
        <p className={styles.backButton}>
          <Link href='./'>
            <a>← Back to ranking overview</a>
          </Link>
        </p>
        <h1>Ranking</h1>
        <h2>Champions League</h2>
        <div class={styles.rankings}>
          <table>
            <thead>
              <tr>
                <th className={styles.rankingsPosition} scope='col'>Pos</th>
                <th scope='col'>User</th>
                <th scope='col'>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.rankingsPosition}>1</td>
                <td>IkBenDeSjaak</td>
                <td className={styles.rankingsPointsData}>301 <span>(+10)</span></td>
              </tr>
              <tr>
                <td className={styles.rankingsPosition}>2</td>
                <td>DikkePannenkoek</td>
                <td className={styles.rankingsPointsData}>100 <span>(+3)</span></td>
              </tr>
              <tr>
                <td className={styles.rankingsPosition} />
                <td>BertDeKnaapie</td>
                <td className={styles.rankingsPointsData}>100 <span>(+10)</span></td>
              </tr>
              <tr>
                <td className={styles.rankingsPosition}>4</td>
                <td>Jantje</td>
                <td className={styles.rankingsPointsData}>180 <span>(+100)</span></td>
              </tr>
              <tr>
                <td className={styles.rankingsPosition}>5</td>
                <td>BertDeKnaap</td>
                <td className={styles.rankingsPointsData}>- <span>(-)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination page={page} amountOfPages={amountOfPages} />
      </Layout>
    </>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  query,
  params,
  req,
  res
}) {
  const user = req.session.user
  const lid = params.lid
  const page = Number(query.page)

  const itemAmount = 1300
  const itemsPerPage = 25
  const amountOfPages = Math.ceil(itemAmount / itemsPerPage)

  if (page > amountOfPages) {
    return {
      redirect: {
        permanent: false,
        destination: `?page=${amountOfPages}`
      }
    }
  } else if (page < 1 || isNaN(page)) {
    return {
      redirect: {
        permanent: false,
        destination: `?page=${1}`
      }
    }
  }

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
      test: 'testtekst',
      page: page,
      amountOfPages: amountOfPages
    }
  }
}
)
