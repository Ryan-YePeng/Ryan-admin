import {axiosG, axiosK} from '../utils/http'

const userUrl = 'auth/details';
export function get() {
  return new Promise(resolve => {
    axiosG(userUrl).then(result => {
      return resolve(result)
    })
  })
}

const getLogUrl = 'api/logs/user?';
export function getLogApi(param) {
  return new Promise(resolve => {
    axiosG(getLogUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const changeEmailUrl = 'api/changeEmail';
export function changeEmailApi(data) {
  return new Promise(resolve => {
    axiosK(changeEmailUrl, data).then(result => {
      return resolve(result)
    })
  })
}

const changePasswordUrl = 'api/user/updatePassword';
export function changePasswordApi(data) {
  return new Promise(resolve => {
    axiosK(changePasswordUrl, data).then(result => {
      return resolve(result)
    })
  })
}

const getCodeUrl = 'api/emailActive';
export function getCodeApi(data) {
  return new Promise(resolve => {
    axiosK(getCodeUrl, data).then(result => {
      return resolve(result)
    })
  })
}
