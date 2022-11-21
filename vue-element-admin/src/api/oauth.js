import request from '../utils/request'

const prefix = '/oauth'

export function getAuthorizationToken(policyParams) {
  return request({
    url: `${prefix}/authorize`,
    method: 'GET',
    params: policyParams
  })
}

export function redeemToken(token, policyId) {
  return request({
    url: `${prefix}/redeem`,
    method: 'POST',
    data: { token, policyId }
  })
}
