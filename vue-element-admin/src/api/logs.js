import request from '../utils/request'

export function getUserLogs(params) {
  return request({
    url: `/logs/user`,
    method: 'GET',
    params: params
  })
}

export function getSysLogs(params) {
  return request({
    url: `/logs/sys`,
    method: 'GET',
    params: params
  })
}
