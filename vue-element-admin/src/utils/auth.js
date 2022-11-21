import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setOauthToken(policyId) {
  return Cookies.set('OauthPolicyId', policyId)
}

export function getOauthToken() {
  return Cookies.get('OauthPolicyId')
}

export function removeOauthToken() {
  return Cookies.remove('OauthPolicyId')
}
