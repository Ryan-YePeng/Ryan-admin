import {axiosDK, axiosd, axiosG} from '../utils/http'

const getUrl = 'api/cache/getCache?';
export function getApi(param) {
  return new Promise(resolve => {
    axiosG(getUrl + param).then(result => {
      resolve(result)
    })
  })
}

const deleteUrl = 'api/cache/delCache';
export function deleteApi(data) {
  return new Promise(resolve => {
    axiosDK(deleteUrl, data).then(result => {
      resolve(result)
    })
  })
}

const deleteAllUrl = 'api/cache/delAll';
export function deleteAllApi() {
  return new Promise(resolve => {
    axiosd(deleteAllUrl).then(result => {
      resolve(result)
    })
  })
}
