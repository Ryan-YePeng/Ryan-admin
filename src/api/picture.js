import {axiosd, axiosds, axiosG} from '../utils/http'

const getUrl = 'api/picture/get?';
export function getApi(param) {
  return new Promise(resolve => {
    axiosG(getUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const deletesUrl = 'api/picture/deleteAll';
export function deletesApi(param) {
  return new Promise((resolve, reject) => {
    axiosds(deletesUrl, param).then(result => {
      return resolve(result)
    }).catch(error => {
      return reject(error)
    })
  })
}

const deleteUrl = 'api/picture/delete/';
export function deleteApi(param) {
  return new Promise((resolve, reject) => {
    axiosd(deleteUrl + param).then(result => {
      return resolve(result)
    }).catch(error => {
      return reject(error)
    })
  })
}
