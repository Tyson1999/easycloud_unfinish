import request from '../utils/request'

export function getCreatorCategory() {
  return request({
    method: 'GET',
    url: '/creator/category'
  })
}

export function addCreator(model) {
  return request({
    method: 'POST',
    url: '/creator/',
    data: model
  })
}

export function getCreatorByName(creator_name) {
  return request({
    method: 'GET',
    url: '/creator',
    params: { creator_name }
  })
}

export function updateCreator(model) {
  return request({
    method: 'PUT',
    url: '/creator',
    data: model
  })
}
