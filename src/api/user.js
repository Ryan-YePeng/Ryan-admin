import {axiosd, axiosG, axiosJ} from '../utils/http'

const getUsersUrl = 'api/user?';
export function getUsersApi(param) {
  return new Promise(resolve => {
    axiosG(getUsersUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const getUserByIdUrl = 'api/user/';
export function getUserByIdApi(param) {
  return new Promise(resolve => {
    axiosG(getUserByIdUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const getTreeUrl = 'api/dept/tree';
export function getTreeApi() {
  return new Promise(resolve => {
    axiosG(getTreeUrl).then(result => {
      return resolve(result)
    })
  })
}

const getRolesUrl = 'api/role/all';
export function getRolesApi() {
  return new Promise(resolve => {
    axiosG(getRolesUrl).then(result => {
      return resolve(result)
    })
  })
}

const getLevelUrl = 'api/role/level';
export function getLevelApi() {
  return new Promise(resolve => {
    axiosG(getLevelUrl).then(result => {
      return resolve(result)
    })
  })
}

const getPositionUrl = 'api/pos/all';
export function getPositionApi() {
  return new Promise(resolve => {
    axiosG(getPositionUrl).then(result => {
      return resolve(result)
    })
  })
}

const editUrl = 'api/user/updateUser';
export function editApi(data) {
  return new Promise(resolve => {
    axiosJ(editUrl, data).then(result => {
      return resolve(result)
    })
  })
}

const addUrl = 'api/user/addUser';
export function addApi(data) {
  return new Promise(resolve => {
    axiosJ(addUrl, data).then(result => {
      return resolve(result)
    })
  })
}

const deleteUrl = 'api/user/delUser/';
export function deleteApi(param) {
  return new Promise((resolve, reject) => {
    axiosd(deleteUrl + param).then(result => {
      return resolve(result)
    }).catch(error => {
      return reject(error)
    })
  })
}
