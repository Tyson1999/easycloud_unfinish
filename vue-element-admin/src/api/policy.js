import request from '../utils/request'

const prefix = '/policy'

/**
 * 根据用户ID, 列出存储策略
 * 管理员则列出所有存储策略
 * @returns {*}
 */
export function getAllPolicies() {
  return request({
    url: `${prefix}`,
    method: 'GET'
  })
}

export function getActivePolicies() {
  return request({
    url: `${prefix}/activePolicies`,
    method: 'GET'
  })
}

export function getPolicyTypes() {
  return request({
    url: `${prefix}/type`,
    method: 'GET'
  })
}

export function addOnePolicy(policyDetail) {
  return request({
    url: `${prefix}`,
    method: 'POST',
    data: policyDetail
  })
}

export function editOnePolicy(policyId, policyDetail) {
  return request({
    url: `${prefix}/${policyId}`,
    data: policyDetail,
    method: 'PUT'
  })
}

