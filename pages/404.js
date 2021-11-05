import styles from '../styles/Custom404.module.css'
import Layout from '../components/layout'

export default function Custom404 () {
  return (
    <>
      <Layout>
        <div className={styles.center}>
          <h1 className={styles.message}>404 - Page Not Found</h1>
        </div>
      </Layout>
    </>
  )
}
