import {axiosd, axiosG, axiosK} from '../utils/http'

const getUrl = 'api/dict/getDict?';
export function getApi(param) {
  return new Promise(resolve => {
    axiosG(getUrl + param).then(result => {
      resolve(result)
    })
  })
}

const addUrl = 'api/dict/addDict';
export function addApi(data) {
  return new Promise(resolve => {
    axiosK(addUrl, data).then(result => {
      resolve(result)
    })
  })
}

const deleteUrl = 'api/dict/delDict/';
export function deleteApi(param) {
  return new Promise((resolve, reject) => {
    axiosd(deleteUrl + param).then(result => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}

const editUrl = 'api/dict/updateDict';
export function editApi(data) {
  return new Promise(resolve => {
    axiosK(editUrl, data).then(result => {
      resolve(result)
    })
  })
}

const getInfoListUrl = 'api/dictDetail/getDetail?';
export function getInfoListApi(param) {
  return new Promise(resolve => {
    axiosG(getInfoListUrl + param).then(result => {
      resolve(result)
    })
  })
}

const searchInfoUrl = 'api/dictDetail/map?';
export function searchInfoApi(param) {
  return new Promise(resolve => {
    axiosG(searchInfoUrl + param).then(result => {
      resolve(result)
    })
  })
}

const deleteInfoUrl = 'api/dictDetail/delDictDetail/';
export function deleteInfoApi(param) {
  return new Promise((resolve, reject) => {
    axiosd(deleteInfoUrl + param).then(result => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}

const addInfoUrl = 'api/dictDetail/addDetail';
export function addInfoApi(data) {
  return new Promise(resolve => {
    axiosK(addInfoUrl, data).then(result => {
      resolve(result)
    })
  })
}

const editInfoUrl = 'api/dictDetail/updateDetail';
export function editInfoApi(data) {
  return new Promise(resolve => {
    axiosK(editInfoUrl, data).then(result => {
      resolve(result)
    })
  })
}
