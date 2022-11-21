import request from '../utils/request'

export function getDownloadablePolicy(cipher) {
  return request({
    method: 'GET',
    url: `/download/${cipher}`
  })
}

export function getDownloadItemUrl(itemId) {
  return request({
    method: 'GET',
    url: `/download/item/${itemId}`
  })
}
