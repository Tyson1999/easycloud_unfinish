import request from '../utils/request'

const prefix = '/file'

export function uploadFTPFiles() {
  return request({
    url: `${prefix}/FTP/upload`,
    method: 'POST'
  })
}

/**
 * 获得用户FTP文件夹中得文件
 * @returns {AxiosPromise}
 */
export function getFTPFileInfo() {
  return request({
    url: `${prefix}/FTP`,
    method: 'GET'
  })
}

export function getFileCategory() {
  return request({
    url: `${prefix}/category`,
    method: 'GET'
  })
}

export function getUploadedFiles(params) {
  return request({
    url: `${prefix}/uploaded`,
    method: 'GET',
    params: params
  })
}

export function updateOneUploadedFile(model) {
  return request({
    url: `${prefix}/uploaded/file/info`,
    method: 'PUT',
    data: { model }
  })
}

export function getUploadedFileAttrs(file_ids) {
  return request({
    url: `${prefix}/uploaded/file-attrs`,
    method: 'POST',
    data: { file_ids }
  })
}

export function reUploadFile(file_id, checkedPolicies) {
  return request({
    url: `${prefix}/uploaded/re-upload`,
    method: 'POST',
    data: { file_id, checkedPolicies }
  })
}

export function getShareLinks(file_id) {
  return request({
    url: `${prefix}/uploaded/share`,
    method: 'GET',
    params: { file_id }
  })
}

export function deleteFile(file_id) {
  return request({
    url: `${prefix}/uploaded/${file_id}`,
    method: 'DELETE'
  })
}

export function getUploadedFileStatus() {
  return request({
    url: `${prefix}/uploaded/statusList`,
    method: 'GET'
  })
}
