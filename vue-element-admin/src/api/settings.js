import request from '../utils/request'

export function getSettings() {
  return request({
    url: '/settings/',
    method: 'GET'
  })
}
