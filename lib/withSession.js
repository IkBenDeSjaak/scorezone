import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'

const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'test_cookie'
}

export function withSessionRoute (handler) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr (handler) {
  return withIronSessionSsr(handler, sessionOptions)
}
