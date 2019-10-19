import {axiosK} from '../utils/http'

const loginUrl = 'auth/login';
export function login(data) {
  return new Promise((resolve, reject) => {
    axiosK(loginUrl, data).then(result => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}

const visitUrl = 'api/visits';
export function visitApi() {
  return new Promise(resolve => {
    axiosK(visitUrl, {}).then(result => {
      resolve(result)
    })
  })
}




const forgetPasswordUrl = 'api/forgetPwd';
export function forgetPasswordApi(data) {
  return new Promise(resolve => {
    axiosK(forgetPasswordUrl, data).then(result => {
      resolve(result)
    })
  })
}
