import {axiosd, axiosFs, axiosG, axiosJ} from '../utils/http'

const getDepartmentUrl = 'api/dept/tree';
export function getDepartmentApi() {
  return new Promise(resolve => {
    axiosG(getDepartmentUrl).then(result => {
      return resolve(result)
    })
  })
}

const getRolesUrl = 'api/role/getRoles?';
export function getRolesApi(param) {
  return new Promise(resolve => {
    axiosG(getRolesUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const getRolesByIdUrl = 'api/role/';
export function getRolesByIdApi(param) {
  return new Promise(resolve => {
    axiosG(getRolesByIdUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const getMenuUrl = 'api/menu/tree';
export function getMenuApi() {
  return new Promise(resolve => {
    axiosG(getMenuUrl).then(result => {
      return resolve(result)
    })
  })
}

const getPermissionUrl = 'api/permission/tree';
export function getPermissionApi() {
  return new Promise(resolve => {
    axiosG(getPermissionUrl).then(result => {
      return resolve(result)
    })
  })
}

const updateRolesUrl = 'api/role/updateRoles';
export function updateRolesApi(data) {
  return new Promise(resolve => {
    axiosJ(updateRolesUrl, data).then(result => {
      return resolve(result)
    })
  })
}

const updateMenuUrl = 'api/role/menuRoles';
export function updateMenuApi(...params) {
  return new Promise(resolve => {
    axiosFs(updateMenuUrl, params).then(result => {
      return resolve(result)
    })
  })
}

const updatePermissionUrl = 'api/role/permissionRoles';
export function updatePermissionApi(...params) {
  return new Promise(resolve => {
    axiosFs(updatePermissionUrl, params).then(result => {
      return resolve(result)
    })
  })
}

const addRolesUrl = 'api/role/addRoles';
export function addApi(data) {
  return new Promise(resolve => {
    axiosJ(addRolesUrl, data).then(result => {
      return resolve(result)
    })
  })
}

const deleteRolesUrl = 'api/role/delRoles/';
export function deleteApi(param) {
  return new Promise((resolve, reject) => {
    axiosd(deleteRolesUrl + param).then(result => {
      return resolve(result)
    }).catch(error => {
      return reject(error)
    })
  })
}

