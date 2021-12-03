import mysql from 'serverless-mysql'

export const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT)
  }
})

export async function querydb (q, values) {
  try {
    const results = await db.query(q, values)
    await db.end()
    return results
  } catch (e) {
    throw Error(e.message)
  }
}

export async function transactiondb (queries) {
  const allQueries = []
  queries.forEach((query) => {
    allQueries.push((r) => {
      let fromPrev = ''
      if (r[0]) {
        if (r[0][query.fromPrev]) {
          fromPrev = r[0][query.fromPrev]
        }
      }
      return Promise.resolve(db.query(`${query.query}`, [...query.params, fromPrev]))
    })
  })

  const transactionChain = [Promise.resolve(db.transaction()), ...allQueries, Promise.resolve(db.transaction().commit())]

  try {
    const results = transactionChain.reduce((prev, curr) => {
      return prev.then(curr)
    })
    await db.end()
    return results
  } catch (e) {
    throw Error(e.message)
  }
}
