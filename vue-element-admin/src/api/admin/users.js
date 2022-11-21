import request from '../../utils/request'

const prefix = '/admin/users'

export function getUsers() {
  return request({
    url: `${prefix}`,
    method: 'GET'
  })
}

export function updateUser(model) {
  return request({
    url: `${prefix}`,
    method: 'PUT',
    data: model
  })
}

export function addUser(model) {
  return request({
    url: `${prefix}`,
    method: 'POST',
    data: model
  })
}
