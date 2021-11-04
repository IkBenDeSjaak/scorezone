export default async function fetcher (input, init) {
  const response = await fetch(input, init)

  // if the server replies, there's always some data in json
  // if there's a network error, it will throw at the previous line
  const data = await response.json()

  // response.ok is true when res.status is 2xx
  if (response.ok) {
    return data
  }

  throw new FetchError({
    message: response.statusText,
    response,
    data
  })
}
